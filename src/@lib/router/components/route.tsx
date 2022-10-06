import React from 'react';

interface Props {
  path: string;
  component: React.ReactNode;
}

export function Route({ path, component }: Props) {
  const matchedInfo = useMatch(path);

  if (!matchedInfo) return null;

  return component;
}
