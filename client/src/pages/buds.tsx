import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';

const BudsPage: NextPage = () => {
  const [buds, setBuds] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const json = await (
        await fetch('http://localhost:5000/buds', {
          headers: { 'User-Id': window.localStorage.getItem('userId')! }
        })
      ).json();

      setBuds(json);
    };
    fn();
  }, []);
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
