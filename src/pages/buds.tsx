import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import BudCard from '@/components/BudCard';
import { getUserId } from '@/utils/functions';

const BudsPage: NextPage = () => {
  const [buds, setBuds] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!getUserId()) {
      router.push('/');
      return;
    }

    const fn = async () => {
      const json = await (
        await fetch('/buds', {
          headers: { 'User-Id': window.localStorage.getItem('userId')! }
        })
      ).json();

      setBuds(json);
    };
    fn();
  }, []);
  console.log(buds);
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
              image={getAvatarImage(bud.avatarSeed)}
              lastMessage={bud.lastMessage}
            />
          ))}
        </Content>
      </Container>
    </Layout>
  );
};

const Container = styled.main`
  ${tw`flex flex-col space-y-4 max-w-md mx-auto`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-16 text-center`}
`;

const Content = styled.div`
  ${tw`flex flex-col space-y-2 p-4`}
`;

function getAvatarImage(seed: string) {
  return `https://avatars.dicebear.com/api/avataaars/${seed}.svg`;
}

export default BudsPage;
