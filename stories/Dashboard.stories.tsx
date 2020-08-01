import React, { ComponentProps } from 'react';
import { App } from '../src';

export default {
  title: 'Dashboard',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
type AppProps = ComponentProps<typeof App>

export const Default = ({
  basePath = "",
  ...rest
}: Partial<AppProps>) => (
  <App basePath={basePath} {...rest} />
);

export const DefaultWithAuth = () => (
  <Default
    requestConfig={{
      headers: new Headers({
        Authorization: `Bearer asdfasdfasd`,
      }),
    }}
  />
);

export const CustomDataKey = () => (
  <Default
    basePath="customDataKey"
    dataKey="data"
  />
);