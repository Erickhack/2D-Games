import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...args }: IProps) {
  return (
    <button
      {...args}
      className={
        'flex cursor-pointer items-center justify-center rounded-[6px] bg-[#047EFD] ' +
        args.className
      }
    >
      {children}
    </button>
  );
}
