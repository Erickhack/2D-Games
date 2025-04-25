export const BearSVG = () => {
  return (
    <svg width={300} height={400} viewBox="0 0 300 300">
      <path
        fill="#795548"
        d="M150 200 Q 250 250 250 350 L 50 350 Q 50 250 150 200"
      />
      <circle fill="#795548" cx="250" cy="150" r="80" />
      <circle fill="#795548" cx="200" cy="80" r="30" />
      <circle fill="#795548" cx="300" cy="80" r="30" />
      <circle fill="#ffffff" cx="250" cy="170" r="50" />
      <circle fill="#333333" cx="250" cy="190" r="15" />
    </svg>
  );
};
