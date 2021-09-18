import Layout from '@/components/Layout';
import React, { useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { NextPage } from 'next';

interface ProfileInput {
  name: string;
  yearOfBirth: number;
  interests: string[];
}

const UserDetails: NextPage = () => {
  const [input, setInput] = useState<ProfileInput>({
    name: '',
    yearOfBirth: 2021,
    interests: []
  });

  const interestsOnChange = (e: any) => {
    if (input.interests.length > 5) return;
    setInput({ ...input, interests: e });
  };

  return (
    <Layout title="ChatBud | Profile">
      <Card>
        <Title style={{ textAlign: 'center', marginBottom: '1em' }}>
          Create your profile
        </Title>
        <Image src={NoProfileSrc} />
        <form>
          <div>
            <label htmlFor="name">
              Name:
              <input
                name="name"
                css={[tw`border`, hoverStyles]}
                onChange={(e: any) => {
                  setInput({ ...input, name: e.target.value });
                }}
              />
            </label>
            <label htmlFor="year">
              Year of Birth:
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
            disabled={
              !input.name || !input.yearOfBirth || input.interests.length === 0
            }
          >
            Save
          </button>
        </form>
      </Card>
    </Layout>
  );
};

const NoProfileSrc =
  'https://cdn.iconscout.com/icon/free/png-256/account-avatar-profile-human-man-user-30448.png';

const Title = styled.h1`
  text-align: 'center';
  margin-bottom: '1em';
  ${tw`text-2xl font-semibold mt-4`}
`;

const Card = styled.div`
  border-radius: 10px;
  padding: 1em 1em 0.3em 1em;
  overflow: hidden;
  margin: 2em;
  ${tw`px-4 py-3 bg-white border rounded-lg items-center`}
`;

const Image = styled.img`
  display: block;
  margin: 0 auto 1em auto;
  ${tw`rounded-full h-24 w-24 border flex items-center justify-center`};
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
  margin: 0.3em 0.3em 0.3em 0;
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
