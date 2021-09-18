import React from 'react';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '@/assets/chatbud_logo.png';

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Link href="/home" passHref>
          <Title>
            <Image width={128} height={36} src={logoSrc} alt="chatbug logo" />
          </Title>
        </Link>
        <Buttons>
          <Link href="/home">Home</Link>
          <Link href="/buds">Buds</Link>
          <Link href="/settings">Settings</Link>
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

const Title = styled.a``;

const Buttons = styled.div`
  ${tw`flex space-x-3`}
`;

export default Navbar;
