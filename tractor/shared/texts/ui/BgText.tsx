import React, { type HTMLAttributes } from 'react';

interface IProps extends HTMLAttributes<HTMLSpanElement> {}

export const BgText = ({ children, ...args }: IProps) => {
  return (
    <span {...args} className={'bg-[#ECEDF0] ' + args.className}>
      {children}
    </span>
  );
};
