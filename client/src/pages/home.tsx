import React from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';
import Image from 'next/image';

import Layout from '@/components/Layout';

import PlantSrc1 from '@/assets/level1.png';

const HomePage: NextPage = () => {
  return (
    <Layout title="ChatBud | Home">
      <Container>
        <Title>Welcome 😊</Title>
        <Content>
          <Aside>Good Job!</Aside>
          <Image width={140} height={300} src={PlantSrc1} alt="Plant" />
          <Aside>+90% growth since yesterday!</Aside>
        </Content>
        <Link href="/" passHref>
          <Button>Find a Bud</Button>
        </Link>
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
  ${tw`px-3 py-1 border rounded-lg`}
`;

export default HomePage;
