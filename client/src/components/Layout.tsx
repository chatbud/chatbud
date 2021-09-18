/* eslint-disable @next/next/no-page-custom-font */
import * as React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  title?: string;
  children?: React.ReactNode;
};

const Layout: React.FunctionComponent<Props> = ({
  title = 'This is the default title',
  children
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Navbar />
    {children}
  </>
);

export default Layout;
