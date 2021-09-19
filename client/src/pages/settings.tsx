import React from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
// import Link from 'next/link';
import router from 'next/router';

import Layout from '@/components/Layout';
import { setUserId } from '@/utils/functions';

const SettingsPage: NextPage = () => {
  const handleSignOut = () => {
    setUserId('');
    router.push('/');
  };

  return (
    <Layout title="Settings">
      <Container>
        <Title>Settings ⚙</Title>
        <Content>
          <Card>
            {/* <Link href="/settings/details" passHref>
            <Anchor>Change Details</Anchor>
          </Link>
          <Link href="/settings/phone" passHref>
            <Anchor>Change Phone Number</Anchor>
          </Link>
          <div tw="py-2" /> */}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </Card>
        </Content>
      </Container>
    </Layout>
  );
};

const Container = styled.main`
  ${tw`flex flex-col space-y-4 max-w-md mx-auto`}
`;

const Content = styled.div`
  ${tw`flex flex-col p-4`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mt-16 text-center`}
`;

const Card = styled.div`
  ${tw`flex flex-col space-y-4 border rounded-lg px-4 py-6`}
`;

const Anchor = styled.a`
  ${tw`text-black text-base p-1 border-b border-green-500 hover:bg-gray-100`}
`;

const Button = Anchor.withComponent('button');

export default SettingsPage;
