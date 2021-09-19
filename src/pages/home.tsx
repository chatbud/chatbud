import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import Plant from '@/components/Plant';

const HomePage: NextPage = () => {
  const router = useRouter();
  return (
    <Layout title="Home">
      <Container>
        <Title>Welcome back! 😊</Title>
        <Content>
          <AsideLeft>Great job yesterday</AsideLeft>
          <Plant progress={0.1} />
          <AsideRight>+25% growth since you&apos;ve started</AsideRight>
        </Content>
        <Button
          onClick={async () => {
            const json = await (
              await fetch('/matchmake', {
                method: 'POST',
                headers: { 'User-Id': window.localStorage.getItem('userId')! }
              })
            ).json();
            router.push(`/buds/${json.id}`);
          }}
        >
          Find a Bud
        </Button>
      </Container>
    </Layout>
  );
};

const Container = styled.main`
  ${tw`flex flex-col justify-center items-center space-y-4`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-16`}
`;

const Content = styled.div`
  ${tw`flex flex-col md:grid md:grid-cols-3 justify-center items-center`}
`;

const AsideLeft = styled.p`
  ${tw`text-lg text-gray-600 text-right`}
`;

const AsideRight = styled.p`
  ${tw`text-lg text-gray-600 text-left mt-4 md:mt-0`}
`;

const Button = styled.a`
  ${tw`w-72 px-4 py-2 border rounded-lg bg-leaf text-white text-center font-semibold tracking-widest`}
`;

export default HomePage;
