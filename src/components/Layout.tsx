/* eslint-disable @next/next/no-page-custom-font */
import * as React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  title?: string;
  children?: React.ReactNode;
  noNavbar?: boolean;
};

const Layout: React.FunctionComponent<Props> = ({
  title = 'This is the default title',
  children,
  noNavbar
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="description"
        content="Reduce social anxiety, one bud at a time."
      />
      <link rel="shortcut icon" type="image/png" href="/favicon.png" />
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
    {!noNavbar && <Navbar />}
    {children}
  </>
);

export default Layout;
