import React from 'react';

interface IProps {
  active: boolean;
}

export const Left = (props: IProps) => {
  return (
    <svg
      width="11"
      height="19"
      viewBox="0 0 11 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.82583 18.6359C9.06262 18.8715 9.36399 19 9.71918 19C10.4295 19 11 18.4431 11 17.7362C11 17.3828 10.8493 17.0614 10.6018 16.8151L3.06751 9.48929L10.6018 2.18489C10.8493 1.93856 11 1.60654 11 1.26381C11 0.556934 10.4295 0 9.71918 0C9.36399 0 9.06262 0.128523 8.82583 0.364149L0.452055 8.50395C0.150685 8.78241 0.0107632 9.12514 0 9.5C0 9.87486 0.150685 10.1962 0.452055 10.4853L8.82583 18.6359Z"
        fill="white"
        fillOpacity={props.active ? '0.6' : ''}
      />
    </svg>
  );
};
