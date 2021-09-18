import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';

const mockData = [
  { name: 'Kooky Kat', msg: 'Hey' },
  { name: 'Dev', msg: 'Hey' },
  { name: 'Dev', msg: "What's up" }
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
          {messages.map(({ name, msg }, id) => (
            <div key={`chat-${msg}-${id}`}>
              <p>{msg}</p>
            </div>
          ))}
          <div>
            <input
              value={typing}
              onChange={(val) => {
                setTyping(val.target.value);
              }}
            />
            <button
              disabled={!typing}
              onClick={() => {
                console.log(typing);
                chat.emit('chat', { room, msg: typing, name: 'Dev' });
              }}
              type="button"
            >
              Send
            </button>
          </div>
        </Content>
      </Container>
    </Layout>
  );
};

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
