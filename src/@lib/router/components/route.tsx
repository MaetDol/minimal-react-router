import React from 'react';
import { useMatch } from '../hooks/useMatch';

interface Props {
  path: string;
  component: React.ReactNode;
}

export function Route({ path, component }: Props) {
  const matchedInfo = useMatch(path);

  if (!matchedInfo) return null;

  return component;
}
