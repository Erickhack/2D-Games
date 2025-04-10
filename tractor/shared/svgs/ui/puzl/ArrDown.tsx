import React from 'react';

interface IProps {
  active?: boolean;
}

export const ArrDown = (props: IProps) => {
  return (
    <svg
      width="19"
      height="13"
      viewBox="0 0 19 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.6359 3.24853C18.8715 2.99022 19 2.66145 19 2.27397C19 1.49902 18.4431 0.876713 17.7362 0.876713C17.3828 0.876713 17.0614 1.0411 16.8151 1.31116L9.48929 9.53033L2.18489 1.31115C1.93856 1.0411 1.60654 0.876711 1.26381 0.876711C0.556935 0.876711 1.492e-06 1.49902 1.39038e-06 2.27397C1.33957e-06 2.66145 0.128524 2.99021 0.36415 3.24853L8.50395 12.3836C8.78241 12.7123 9.12514 12.865 9.5 12.8767C9.87486 12.8767 10.1962 12.7123 10.4853 12.3836L18.6359 3.24853Z"
        fill="white"
        fillOpacity={props.active ? '0.5' : ''}
      />
    </svg>
  );
};
