import React from 'react';
import { App } from '../src';

export default {
  title: 'Dashboard',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = ({
  basePath = "",
  requestConfig,
}: Partial<{ basePath: string; requestConfig: RequestInit }>) => (
  <App basePath={basePath} requestConfig={requestConfig} />
);

export const DefaultWithAuth = () => (
  <Default
    basePath=""
    requestConfig={{
      headers: new Headers({
        Authorization: `Bearer asdfasdfasd`,
      }),
    }}
  />
);
