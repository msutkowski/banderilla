import React from 'react';
import { App } from '../src';

export default {
  title: 'Dashboard',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = ({
  basePath = 'http://localhost',
  ...props
}: Partial<{ basePath: string; [key: string]: any }>) => (
  <App basePath="" {...props} />
);
