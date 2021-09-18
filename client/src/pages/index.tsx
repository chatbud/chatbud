import React, { useState, useEffect, HTMLInputEvent } from 'react';
import tw, { styled, TwStyle } from 'twin.macro';
import Modal from 'react-modal';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import seeds from '@/assets/seeds.jpg';

const IndexPage: NextPage = () => {
  const [userId, setUserId] = useState('');

  const [isAuthed, setIsAuthed] = useState(false);

  const [renderLogin, setRenderLogin] = useState(false);
  const [render2FA, setRender2FA] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [validationMessage, setValidationMessage] = useState('');
  const Router = useRouter();

  useEffect(() => {
    setUserId(userId || window.localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    // Replace w/ Twilio api auth call
    const validId = 'Developer at Shopify';
    if (!isAuthed) setIsAuthed(userId === validId);
  }, [userId]);

  useEffect(() => {
    if (isAuthed) Router.push('/home');
  }, [isAuthed]);

  const onPhoneInput = (value: string) => {
    if (/^(\d|-| |\+|^$){0,15}$/.test(value)) setPhoneNumber(value);
  };

  const authenticateUser = () => {
    // Replace w/ BE call
    const validCode = 'vihng';
    const isAuthorized = twoFactorCode === validCode;

    setValidationMessage(isAuthorized ? '' : 'Invalid code! Try again');
    if (isAuthorized) {
      setIsAuthed(true);
      return;
    }
  };

  const onJoinPress = () => {
    if (!render2FA) {
      setValidationMessage(!!phoneNumber.length ? '' : 'Enter a phone number');
      if (phoneNumber.length) {
        // NOTE: Maybe only set this to true when Twilio lets us know it's a valid phone #?
        // NOTE: We could have a loading phase
        setRender2FA(true);
        return;
      }
    } else {
      if (twoFactorCode.length) {
        authenticateUser();
        return;
      }
      setValidationMessage('Enter the code sent to your phone');
    }
  };

  return (
    <Layout title="ChatBud - Grow with friends!" noNavbar={!isAuthed}>
      <Container>
        <Title>ChatBud</Title>
        Yeah we make friends n shit
        <Image src={seeds} />
        <Modal
          isOpen={renderLogin}
          onRequestClose={() => setRenderLogin(false)}
          contentLabel="Become a ChatBud!"
          ariaHideApp={false}
        >
          <>
            <Title> Join!</Title>
            <label htmlFor="Enter Phone #"> Phone Number: </label>
            <StyledInput
              name="Phone Number"
              value={phoneNumber}
              onInput={(e: HTMLInputEvent) => onPhoneInput(e.target.value)}
              marginBot={10}
            />
            {render2FA && (
              <>
                <label htmlFor="Enter Code">
                  Enter Code Sent To Your Phone:{' '}
                </label>
                <StyledInput
                  name="Enter Code"
                  value={twoFactorCode}
                  onInput={(e: HTMLInputEvent) =>
                    setTwoFactorCode(e.target.value)
                  }
                  marginBot={10}
                />
              </>
            )}
            <StyledButton onClick={onJoinPress}>Join!</StyledButton>
            <br />
            {validationMessage}
          </>
        </Modal>
        <StyledButton onClick={() => !renderLogin && setRenderLogin(true)}>
          Become a ChatBud!
        </StyledButton>
      </Container>
    </Layout>
  );
};

export default IndexPage;

const StyledButton = styled.button`
  /* background-color: green; */
  padding: 5px;
  border: 1px solid black;
  /* position: relative; */
  /* left: 1%; */
`;

const Container = styled.div`
  ${tw`absolute inset-0 w-full h-screen flex flex-col justify-center items-center`}/* background-color: black; */
`;

const Title = styled.h1`
  ${tw`text-4xl sm:text-5xl font-semibold tracking-wide mb-12`}
`;

const linkStyles: Record<string, TwStyle> = {
  red: tw`text-red-500 hover:text-red-700`,
  yellow: tw`text-yellow-500 hover:text-yellow-700`,
  green: tw`text-green-500 hover:text-green-700`,
  blue: tw`text-blue-500 hover:text-blue-700`,
  indigo: tw`text-indigo-500 hover:text-indigo-700`,
  purple: tw`text-purple-500 hover:text-purple-700`
};

const StyledInput = styled.input`
  border: 1px solid green;
  border-radius: 5px;
  ${({ marginBot }) => `margin-bottom: ${marginBot ? marginBot : 0}px`}
`;
