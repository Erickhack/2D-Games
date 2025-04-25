import React from 'react';

export const BearSVG = () => {
  return (
    <svg className="bear-graphics" viewBox="0 0 300 400">
      <path
        className="bear-body"
        d="M150 200 Q 250 250 250 350 L 50 350 Q 50 250 150 200"
      />
      <circle className="bear-body" cx="250" cy="150" r="80" />
      <circle className="bear-body" cx="200" cy="80" r="30" />
      <circle className="bear-body" cx="300" cy="80" r="30" />
      <circle className="bear-face" cx="250" cy="170" r="50" />
      <circle className="bear-nose" cx="250" cy="190" r="15" />
    </svg>
  );
};
