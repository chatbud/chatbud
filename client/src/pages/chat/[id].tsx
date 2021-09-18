import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
import Message from '@/components/Message';

const mockData = [
  {
    name: 'Kooky Kat',
    msg: 'Hey',
    image: 'https://avatars.dicebear.com/api/avataaars/devon.svg'
  },
  {
    name: 'Dev',
    msg: 'Hey',
    image: 'https://avatars.dicebear.com/api/avataaars/nami3.svg'
  },
  {
    name: 'Dev',
    msg: "What's up",
    image: 'https://avatars.dicebear.com/api/avataaars/nami3.svg'
  },
  {
    name: 'Kooky Kat',
    msg: 'Not much hbu',
    image: 'https://avatars.dicebear.com/api/avataaars/devon.svg'
  }
];

const BudsPage: NextPage = (props) => {
  const [messages, setMessages] = useState(mockData);
  const [typing, setTyping] = useState('');
  const [chat, setChat] = useState<any>(null);
  const router = useRouter();
  const room = router.query.id;
  useEffect(() => {
    if (!room) return;
    const socket = io('http://localhost:5000');
    socket.emit('Hello!');
    socket.emit('joinRoom', room);
    setChat(socket);
    socket.on('chat', (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });
  }, [room]);

  return (
    <Layout title="Messages with Kooky Kat">
      <Container>
        <Title>Kooky Kat 🌱</Title>
        <Content>
          {messages.map(({ name, msg, image }, id) => (
            <Message you={name === 'Dev'} msg={msg} name={name} image={image} />
          ))}
          <div>
            <Input
              value={typing}
              onChange={(val) => {
                setTyping(val.target.value);
              }}
            />
            <Button
              disabled={!typing}
              onClick={() => {
                console.log(typing);
                chat.emit('chat', { room, msg: typing, name: 'Dev' });
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
  ${tw`flex flex-col space-y-4 p-4`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-4`}
`;

const Content = styled.div`
  ${tw`flex flex-col space-y-2`}
`;

export default BudsPage;
