import React from 'react';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';

interface BudCardProps {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
}

const BudCard: React.FC<BudCardProps> = ({ id, name, lastMessage, image }) => {
  return (
    <Link href={`/buds/${id}`} passHref>
      <Container>
        {image ? (
          <Image src={image} alt="profile photo" />
        ) : (
          <NoImage>{name.charAt(0)}</NoImage>
        )}
        <Name>{name}</Name>
        <LastMessage>〝{lastMessage}〞</LastMessage>
      </Container>
    </Link>
  );
};

const Container = styled.a`
  ${tw`px-4 py-3 bg-white border rounded-lg flex flex-row items-center`}
`;

const Image = styled.img`
  ${tw`w-8 h-8 rounded-full mr-4 bg-green-600 text-white font-semibold flex justify-center items-center`}
`;

const NoImage = Image.withComponent('span');

const Name = styled.span`
  ${tw`text-lg text-gray-800`}
`;

const LastMessage = styled.span`
  ${tw`text-lg ml-5 text-gray-400`}
`;

export default BudCard;
