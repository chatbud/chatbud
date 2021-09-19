import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import Message from '@/components/Message';

const BudsPage: NextPage = (props) => {
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
        if (members[0].id === myId()) {
          setOther(members[1].name);
        } else {
          setOther(members[0].name);
        }
      });
    });
  }, [room]);

  return (
    <Layout title="Messages with Kooky Kat">
      <Container>
        <Title>{other} 🌱</Title>
        <Content>
          {messages.map(({ id, msg, image }, index) => (
            <Message
              key={`${id}-${index}`}
              you={id === Number(window.localStorage.getItem('userId'))}
              msg={msg}
              id={id}
              image={image}
            />
          ))}
          <div>
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
                    id: Number(window.localStorage.getItem('userId'))
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
                  id: Number(window.localStorage.getItem('userId'))
                });
                setTyping('');
              }}
              type="button"
            >
              Send
            </Button>
          </div>
        </Content>
      </Container>
    </Layout>
  );
};

const Button = styled.button`
  ${tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
`;

const Input = styled.input`
  ${tw`bg-gray-200 border-gray-200 border-b-2 border-blue-500 focus:border-blue-700 focus:outline-none focus:bg-white focus:border-blue-700 text-gray-700 py-2 px-4 rounded`}
`;
const Container = styled.main`
  ${tw`flex flex-col space-y-4 p-4 overflow-y-scroll`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-4`}
`;

const Content = styled.div`
  ${tw`flex flex-col space-y-2`}
`;

function myId() {
  return Number(window.localStorage.getItem('userId'));
}

export default BudsPage;
