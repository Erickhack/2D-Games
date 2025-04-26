import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...args }: IProps) {
  return (
    <button
      {...args}
      className={`flex cursor-pointer items-center justify-center rounded-md bg-[#047EFD] ${args.className}`}
    >
      {children}
    </button>
  );
}
