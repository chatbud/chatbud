import React from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';

import Layout from '@/components/Layout';
import Plant from '@/components/Plant';

const HomePage: NextPage = () => {
  return (
    <Layout title="Home">
      <Container>
        <Title>Welcome 😊</Title>
        <Content>
          <Aside>Good Job!</Aside>
          <Plant progress={0.1} />
          <Aside>+90% growth since yesterday!</Aside>
        </Content>
        <Button
          onClick={async () => {
            const json = await (
              await fetch('http://localhost:5000/matchmake', {
                method: 'POST',
                headers: { 'User-Id': window.localStorage.getItem('userId')! }
              })
            ).json();

            window.location.pathname = `/buds/${json.id}`;
          }}
        >
          Find a Bud
        </Button>
      </Container>
    </Layout>
  );
};

const Container = styled.main`
  ${tw`flex flex-col justify-center items-center space-y-8`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-16`}
`;

const Content = styled.div`
  ${tw`flex flex-col justify-center items-center`}
`;

const Aside = styled.p`
  ${tw`text-lg text-gray-600`}
`;

const Button = styled.a`
  ${tw`px-3 py-1 border rounded-lg hover:bg-gray-200 cursor-pointer`}
`;

export default HomePage;
