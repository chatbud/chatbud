import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
<<<<<<< HEAD:client/src/pages/buds/[id].tsx
import tw, { css, styled } from 'twin.macro';
import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';

=======
import tw, { styled } from 'twin.macro';

import { io } from 'socket.io-client';
import { useRouter } from 'next/dist/client/router';
>>>>>>> ea850d7 (prod):src/pages/buds/[id].tsx
import Layout from '@/components/Layout';
import Message from '@/components/Message';
import { getUserSeed } from '@/utils/functions';

const BudsPage: NextPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState('');
  const [chat, setChat] = useState<any>(null);
  const [other, setOther] = useState('...');
  const [budInterests, setBudInterests] = useState([]);
  const [myInterests, setMyInterests] = useState([]);
  const router = useRouter();
  const room = router.query.id;

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (!room) return;
    const socket = io();
    socket.emit('joinRoom', room);
    setChat(socket);
    socket.on('chat', (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });

    fetch(`/buds/${room}`).then((res) => {
      res.json().then((data) => {
        setMessages(data.msgs);
        const members = data.users;
        if (members[0].id === myId()) {
          setOther(members[1].name);
          setBudInterests(members[1].interests);
          setMyInterests(members[0].interests);
        } else {
          setOther(members[0].name);
          setBudInterests(members[0].interests);
          setMyInterests(members[1].interests);
        }
      });
    });
  }, [room]);

  function buildSuggestions() {
    const match = myInterests.filter((element) =>
      budInterests.includes(element)
    );
    let suggestions = `${other} is interested in `;
    if (match.length > 0) {
      return (
        <p>
          You two are both interested in <strong>{match}</strong>!
        </p>
      );
    }
    if (budInterests.length === 1) {
      suggestions += `${budInterests[0]}.`;
    } else {
      const copy = Array.from(budInterests);
      const last = copy.pop();
      suggestions += `${copy.join(', ')} and ${last}.`;
    }
    return <p>{suggestions}</p>;
  }

  const SuggestionSection = () => {
    return (
      <div css={[suggestionsStyle]} role="alert">
        <strong className="font-bold">👋 Say hi to {other}!</strong>
        <span css={[tw`block sm:inline`]}>{buildSuggestions()}</span>
      </div>
    );
  };

  return (
    <Layout title={`Message with ${other}`}>
      <Container>
        <Title>{other} 🌱</Title>
        <Content>
<<<<<<< HEAD:client/src/pages/buds/[id].tsx
          <Messages>
            {messages.map(({ id, msg, avatarSeed }, index) => (
              <Message
                key={`${id}-${index}`}
                you={id === myId()}
                msg={msg}
                id={id}
                image={getAvatarImage(avatarSeed)}
              />
            ))}
          </Messages>
          <InputContainer>
            {SuggestionSection()}
=======
          {messages.map(({ id, msg, image }, index) => (
            <Message
              // eslint-disable-next-line react/no-array-index-key
              key={`${id}-${index}`}
              you={id === myId()}
              msg={msg}
              id={id}
              image={image}
            />
          ))}
          <div>
>>>>>>> ea850d7 (prod):src/pages/buds/[id].tsx
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
                    id: myId(),
                    avatarSeed: getUserSeed()
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
                  id: myId()
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

const suggestionsStyle = css`
  ${tw`bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative`};
`;
const Button = styled.button`
  ${tw`bg-leaf hover:bg-leaf-dark text-white font-bold py-2 px-4 rounded`}
`;

const Messages = styled.div`
  ${tw`flex flex-col space-y-2`}
`;

const Input = styled.input`
  ${tw`bg-gray-200 border-b-2 border-leaf focus:outline-none focus:bg-gray-100 focus:border-leaf-dark text-gray-700 py-2 px-4 rounded w-full`}
`;

const Container = styled.main`
  ${tw`flex flex-col space-y-4 p-4 max-w-2xl mx-auto`}
`;

const InputContainer = styled.div`
  ${tw`flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-stretch fixed left-0 bottom-0 right-0 w-full p-4 bg-white border-t`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-4`}
`;

const Content = styled.div`
  ${tw`flex flex-col pb-24`}
`;

function myId() {
  return Number(window.localStorage.getItem('userId'));
}

function getAvatarImage(seed: string) {
  return `https://avatars.dicebear.com/api/avataaars/${seed}.svg`;
}

export default BudsPage;
