import React, { useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';

const mockData = [
  { id: '1', name: 'Kooky Kat', image: '/mockdata.jpg' },
  { id: '2', name: 'Deen Haque' },
  { id: '3', name: 'Omegalul', image: '/mockdata.jpg' },
  { id: '4', name: 'the mackeral', image: '/mockdata.jpg' }
];

const BudsPage: NextPage = () => {
  const [buds, setBuds] = useState(mockData);
  return (
    <Layout title="Buds">
      <Container>
        <Title>Your Buds 🌱</Title>
        <Content>
          {buds.map((bud) => (
            <BudCard
              key={`bud-${bud.id}`}
              id={bud.id}
              name={bud.name}
              image={bud.image}
            />
          ))}
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
