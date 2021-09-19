import React, { useState, useEffect, HTMLInputEvent } from 'react';
import tw, { styled } from 'twin.macro';
import Modal from 'react-modal';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import { getUserId, setUserId } from '@/utils/functions';
import logoSrc from '@/assets/chatbud_logo.png';

const IndexPage: NextPage = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  const [renderLogin, setRenderLogin] = useState(false);
  const [render2FA, setRender2FA] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [validationMessage, setValidationMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const uid = getUserId();
    if (uid) {
      setUserId(uid);
      setIsAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) {
      router.push('/home');
    }
  }, [isAuthed]);

  const onPhoneInput = (value: string) => {
    if (/^(\d|-| |\+|^$){0,15}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const onJoinPress = async () => {
    if (!render2FA) {
      setValidationMessage(phoneNumber.length ? '' : 'Enter a phone number');
      if (phoneNumber.length) {
        const res = await fetch('http://localhost:5000/login', {
          method: 'POST',
          body: JSON.stringify({ phone_number: phoneNumber }),
          headers: { 'Content-Type': 'application/json' }
        }).then((r) => r.json());
        const validPhone = res.next_step === 'code';
        if (validPhone) {
          setRender2FA(true);
        } else {
          setValidationMessage('Bad phone number');
        }
      }
    } else {
      if (!twoFactorCode.length) {
        setValidationMessage('Please enter the code sent to your phone');
        return;
      }

      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: twoFactorCode
        }),
        headers: { 'Content-Type': 'application/json' }
      }).then((r) => r.json());

      if (res.redirect) {
        router.push(res.redirect);
      } else {
        setValidationMessage('Invalid code. Please check your phone.');
      }
    }
  };

  return (
    <Layout title="ChatBud - Grow with friends!" noNavbar={!isAuthed}>
      <Container>
        <Title>
          <Image src={logoSrc} />
        </Title>
        <Subtitle>Growing your network, one bud at a time</Subtitle>
        <Modal
          isOpen={renderLogin}
          onRequestClose={() => setRenderLogin(false)}
          contentLabel="Become a ChatBud!"
          ariaHideApp={false}
        >
          <>
            <Title>Join!</Title>
            <label htmlFor="Enter Phone #">Phone Number: </label>
            <StyledInput
              name="Phone Number"
              value={phoneNumber}
              onInput={(e: HTMLInputEvent) => onPhoneInput(e.target.value)}
              marginBot={10}
            />
            <br />
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
            {validationMessage && (
              <div
                css={[
                  tw`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mt-4`
                ]}
                role="alert"
              >
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{validationMessage}</span>
              </div>
            )}
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
  ${tw`flex flex-col items-center space-y-4`}
`;

const Title = styled.h1`
  ${tw`px-12 py-4 max-w-md mt-8`}
`;

const Subtitle = styled.h2`
  ${tw`text-base tracking-wide text-gray-700`}
`;

const StyledInput = styled.input`
  border: 1px solid green;
  border-radius: 5px;
  ${({ marginBot }) => `margin-bottom: ${marginBot || 0}px`}
`;
