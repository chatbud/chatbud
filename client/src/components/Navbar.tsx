import React from 'react';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Link href="/" passHref>
          <Title>ChatBud</Title>
        </Link>
        <Buttons>
          <Link href="/">Link</Link>
          <Link href="/">Link</Link>
          <Link href="/">Link</Link>
          <Link href="/">Link</Link>
        </Buttons>
      </Wrapper>
    </Container>
  );
};

const Container = styled.nav`
  ${tw`sticky top-0 z-10 bg-white border-b border-solid border-gray-300`}
`;

const Wrapper = styled.div`
  ${tw`relative flex items-center justify-between h-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`}
`;

const Title = styled.a`
  ${tw`text-2xl font-semibold`}
`;

const Buttons = styled.div`
  ${tw`flex space-x-3`}
`;

export default Navbar;
