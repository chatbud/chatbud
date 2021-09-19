import React from 'react';
import tw, { styled } from 'twin.macro';
import Link from 'next/link';

interface MessageProps {
  msg: string;
  id: string;
  image: string;
  you: boolean;
}

const Message: React.FC<MessageProps> = ({ msg, id, image, you }) => {
  const MsgContainer = you ? YouContainer : Container;
  return (
    <MsgContainer>
      {image ? (
        <Image src={image} alt="profile photo" />
      ) : (
        <NoImage>{id}</NoImage>
      )}
      <Name you={you}>{msg}</Name>
    </MsgContainer>
  );
};

const Container = styled.a`
  ${tw`px-4 py-3 bg-white border bg-blue-100 rounded-lg flex flex-row items-center hover:bg-blue-200`}
`;

const YouContainer = styled.a`
  ${tw`px-4 py-3 bg-white border bg-green-500 rounded-lg flex flex-row-reverse items-center hover:bg-green-600`}
`;

const Image = styled.img`
  ${tw`w-8 h-8 rounded-full mr-2 ml-2 text-white bg-white font-semibold flex justify-center items-center`}
`;

const NoImage = Image.withComponent('span');

const Name = styled.span(({ you }: { you: boolean }) => [
  tw`text-lg`,
  you ? tw`text-white` : 'text-gray-600'
]);

export default Message;
