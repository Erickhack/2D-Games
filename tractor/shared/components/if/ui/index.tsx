import React from 'react';

interface IProps {
  children: React.ReactNode;
  conditional: boolean;
}

export const If = ({ children, conditional }: IProps) => {
  return conditional ? <>{children}</> : null;
};
