import React from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';

import Layout from '@/components/Layout';

const Card = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  ${tw`bg-blue-500`}
`;

const IndexPage: NextPage = () => {
  return (
    <Layout title="ChatBud | Home">
      <Card>
        <div tw="text-xl">Deenda Deenda Deenda Deenda Deenda</div>
      </Card>
    </Layout>
  );
};

export default IndexPage;
