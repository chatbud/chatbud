/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import { io } from 'socket.io-client';

import { useRouter } from 'next/dist/client/router';
import Layout from '@/components/Layout';
import Message from '@/components/Message';
import { getUserId } from '@/utils/functions';

const BudsPage: NextPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState('');
  const [chat, setChat] = useState<any>(null);
  const [other, setOther] = useState('...');
  const router = useRouter();
  const room = router.query.id;

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (!room) return;
    const socket = io('http://localhost:5000');
    socket.emit('joinRoom', room);
    setChat(socket);
    socket.on('chat', (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });

    fetch(`http://localhost:5000/buds/${room}`).then((res) => {
      res.json().then((data) => {
        setMessages(data.msgs);
        const members = data.users;
        if (members[0].id === Number(getUserId())) {
          setOther(members[1].name);
        } else {
          setOther(members[0].name);
        }
      });
    });
  }, [room]);

  return (
    <Layout title={`Message with ${other}`}>
      <Container>
        <Title>{other} 🌱</Title>
        <Content>
          <Messages>
            {messages.map(({ id, msg, image }, index) => (
              <Message
                key={`${id}-${index}`}
                you={id === Number(getUserId())}
                msg={msg}
                id={id}
                image={image}
              />
            ))}
          </Messages>
          <InputContainer>
            <Input
              value={typing}
              onChange={(val) => {
                setTyping(val.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  chat.emit('chat', {
                    room,
                    msg: typing,
                    id: Number(getUserId())
                  });
                  setTyping('');
                }
              }}
            />
            <Button
              disabled={!typing}
              onClick={() => {
                chat.emit('chat', {
                  room,
                  msg: typing,
                  id: Number(getUserId())
                });
                setTyping('');
              }}
              type="button"
            >
              Send
            </Button>
          </InputContainer>
        </Content>
      </Container>
    </Layout>
  );
};

const Button = styled.button`
  ${tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
`;

const Messages = styled.div`
  ${tw`flex flex-col space-y-2`}
`;

const Input = styled.input`
  ${tw`bg-gray-200 border-b-2 border-blue-500 focus:outline-none focus:bg-gray-100 focus:border-blue-700 text-gray-700 py-2 px-4 rounded w-full`}
`;

const Container = styled.main`
  ${tw`flex flex-col space-y-4 p-4 max-w-2xl mx-auto`}
`;

const InputContainer = styled.div`
  ${tw`flex flex-row space-x-4 fixed left-0 bottom-0 right-0 w-full p-4 bg-white border-t`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-4`}
`;

const Content = styled.div`
  ${tw`flex flex-col pb-24`}
`;

export default BudsPage;
