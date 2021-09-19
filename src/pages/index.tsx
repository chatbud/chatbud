/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
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

      const res = await fetch('http://localhost:5000/login/2fa', {
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

  const closeModal = () => {
    setValidationMessage('');
    setRender2FA(false);
    setRenderLogin(false);
  };

  return (
    <Layout title="ChatBud - Grow with friends!" noNavbar={!isAuthed}>
      <Container>
        <Title>
          <Image src={logoSrc} />
        </Title>
        <Subtitle>Growing your network, one bud at a time</Subtitle>
        {renderLogin && (
          <>
            <div
              css={[
                tw`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-3`
              ]}
              onClick={closeModal}
            >
              <div
                css={[tw`relative w-auto my-6 mx-auto max-w-3xl`]}
                onClick={(e) => {
                  // do not close modal if anything inside modal content is clicked
                  e.stopPropagation();
                }}
              >
                <div
                  css={[
                    tw`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`
                  ]}
                >
                  <div
                    css={[
                      tw`flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t`
                    ]}
                  >
                    <h3 css={[tw`text-3xl font-semibold`]}>Join ChatBud🌱</h3>
                    <button
                      type="button"
                      css={[
                        tw`p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none`
                      ]}
                      onClick={closeModal}
                    >
                      <span
                        css={[
                          tw`bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none`
                        ]}
                      >
                        ×
                      </span>
                    </button>
                  </div>
                  <div css={[tw`relative p-6 flex-auto`]}>
                    {!render2FA ? (
                      <>
                        <p>
                          Enter your phone number to authenticate your account.
                        </p>
                        <StyledInput
                          name="Phone Number"
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onInput={(e: any) => onPhoneInput(e.target.value)}
                          // @ts-ignore
                          marginBot={10}
                        />
                      </>
                    ) : (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label htmlFor="Enter Code">
                          Enter the code sent to your phone:
                        </label>
                        <StyledInput
                          name="Enter Code"
                          placeholder="Verification Code"
                          value={twoFactorCode}
                          onInput={(e: any) => setTwoFactorCode(e.target.value)}
                          // @ts-ignore
                          marginBot={10}
                        />
                      </>
                    )}
                    <br />
                    {validationMessage && (
                      <div
                        css={[
                          tw`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4`
                        ]}
                        role="alert"
                      >
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">
                          {validationMessage}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    css={[
                      tw`flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b`
                    ]}
                  >
                    <button
                      css={[
                        tw`text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`
                      ]}
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      css={[
                        tw`bg-leaf text-white active:bg-leaf-dark font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`
                      ]}
                      type="button"
                      onClick={onJoinPress}
                    >
                      {!render2FA ? 'Send' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div css={[tw`opacity-25 fixed inset-0 z-40 bg-black`]} />
          </>
        )}
        <button
          type="button"
          css={[
            tw`bg-leaf hover:bg-leaf-dark text-white font-bold py-2 px-4 rounded`
          ]}
          onClick={() => !renderLogin && setRenderLogin(true)}
        >
          Become a ChatBud!
        </button>
      </Container>
    </Layout>
  );
};

export default IndexPage;

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
  ${({ marginBot }: { marginBot: number }) =>
    `margin-bottom: ${marginBot || 0}px`}
`;
