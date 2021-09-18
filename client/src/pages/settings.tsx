import React, { useState } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';

import Layout from '@/components/Layout';

const SettingsPage: NextPage = () => {
  return (
    <Layout title="Buds">
      <Container>
        <Title>Settings ⚙</Title>
        <Card>
          <Link href="/settings/details" passHref>
            <Anchor>Change Details</Anchor>
          </Link>
          <Link href="/settings/phone" passHref>
            <Anchor>Change Phone Number</Anchor>
          </Link>
          <div tw="py-2" />
          <Link href="/" passHref>
            <Anchor>Sign Out</Anchor>
          </Link>
        </Card>
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

const Card = styled.div`
  ${tw`flex flex-col space-y-4 border rounded-lg px-4 py-6`}
`;

const Anchor = styled.a`
  ${tw`text-black text-base p-1 border-b border-green-500 hover:bg-gray-100`}
`;

export default SettingsPage;
