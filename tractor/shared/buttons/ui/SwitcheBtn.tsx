import React from 'react';

interface IProps extends React.PropsWithChildren {
  active: boolean;

  span1: string;
  fn1: (...args: any[]) => any;

  span2: string;
  fn2: (...args: any[]) => any;
}

export const SwitcheBtn = (props: IProps) => {
  return (
    <div className="relative flex rounded-[20px] bg-white p-2">
      <div
        className="absolute top-2 left-2 h-[42px] w-[151px] rounded-xl bg-[#047EFD] transition-transform duration-300"
        style={{
          transform: props.active ? 'translateX(0)' : 'translateX(151px)',
        }}
      />

      <button
        className={`z-10 h-[42px] w-[151px] px-6 py-2.5 transition-colors duration-300 ${
          props.active ? 'text-white' : 'text-[#047EFD]'
        }`}
        onClick={props.fn1}
      >
        <span>{props.span1}</span>
      </button>
      <button
        className={`z-10 h-[42px] w-[151px] px-6 py-2.5 transition-colors duration-300 ${
          !props.active ? 'text-white' : 'text-[#047EFD]'
        }`}
        onClick={props.fn2}
      >
        {props.span2}
      </button>
    </div>
  );
};
