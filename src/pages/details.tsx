import React, { useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import { setUserId, setUserSeed } from '@/utils/functions';

interface ProfileInput {
  name: string;
  yearOfBirth: number;
  interests: string[];
  avatarSeed: string;
}

const UserDetails: NextPage = () => {
  const [input, setInput] = useState<ProfileInput>({
    name: '',
    yearOfBirth: 2021,
    interests: [],
    avatarSeed: 'hello'
  });
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const interestsOnChange = (e: any) => {
    if (input.interests.length > 5) return;
    setInput({ ...input, interests: e });
  };

  const saveProfile = () => {
    setError(false);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    };

    fetch('/user/create', requestOptions).then((response) => {
      if (!response.ok) {
        setError(true);
      } else {
        setUserSeed(input.avatarSeed);
        response.json().then((data) => setUserId(data.id));
        router.push('/home');
      }
    });
  };

  const errorBanner = error && (
    <div
      css={[
        tw`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4`
      ]}
      role="alert"
    >
      <strong className="font-bold">Oops! </strong>
      <span className="block sm:inline">
        A problem occurred saving your profile.
      </span>
    </div>
  );

  const randomizeAvatar = () => {
    const seed = (Math.random() + 1).toString(36).substring(2);
    setInput({ ...input, avatarSeed: seed });
  };

  return (
    <Layout title="Details" noNavbar>
      <Title style={{ textAlign: 'center' }}>Profile</Title>
      <Card>
        {errorBanner}
        <div style={{ position: 'relative' }}>
          <div>
            <ProfileImage
              src={`https://avatars.dicebear.com/api/avataaars/${input.avatarSeed}.svg`}
              onClick={randomizeAvatar}
            />
            <RefreshIcon
              src="http://simpleicon.com/wp-content/uploads/refresh.svg"
              alt="refresh"
            />
          </div>
        </div>
        <p
          style={{
            color: '#696969',
            fontSize: '11px',
            textAlign: 'center'
          }}
        >
          Click the icon to randomize an avatar
        </p>
        <form>
          <div>
            <label htmlFor="name">
              Name:
              <br />
              <input
                name="name"
                css={[tw`border`, hoverStyles]}
                onChange={(e: any) => {
                  setInput({ ...input, name: e.target.value });
                }}
              />
            </label>
            <br />
            <label htmlFor="year">
              Year of Birth:
              <br />
              <input
                name="year"
                type="number"
                css={[tw`border`, hoverStyles]}
                onChange={(e: any) => {
                  setInput({ ...input, yearOfBirth: e.target.value });
                }}
              />
            </label>
          </div>
          Enter up to 5 interests:
          <TagsInput
            value={input.interests}
            onChange={interestsOnChange}
            inputProps={{
              placeholder: input.interests.length < 5 && 'Add interest'
            }}
            maxTags={5}
            onlyUnique
          />
          <button
            type="button"
            css={[tw`border`, btnStyles]}
            onClick={saveProfile}
          >
            Save
          </button>
        </form>
      </Card>
    </Layout>
  );
};

const Title = styled.h1`
  text-align: 'center';
  margin-bottom: '1em';
  ${tw`text-2xl font-semibold mt-4`}
`;

const Card = styled.div`
  overflow: hidden;
  margin: 0.5em;
  ${tw`px-4 py-3 bg-white border rounded-lg items-center`}
`;

const ProfileImage = styled.img`
  display: block;
  margin: 0 auto 1em auto;
  ${tw`rounded-full h-24 w-24 border flex items-center justify-center`};
  &:hover {
    border: 1px solid #72bc59;
  }
`;

const RefreshIcon = styled.img`
  position: absolute;
  top: 75%;
  left: 52%;
  width: 2em;
`;

const hoverStyles = css`
  &:hover {
    border-color: black;
    ${tw`text-black`}
  }
`;

const btnStyles = css`
  display: inline-block;
  padding: 0.3em 1.2em;
  margin: 0.5em 0.3em 0 0;
  border-radius: 2em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  color: #ffffff;
  background-color: #72bc59;
  text-align: center;
  transition: all 0.2s;
  float: right;
  &:hover {
    background-color: #44832f;
  }
`;

export default UserDetails;
