export function takeRadioText(range: { title: string; messages: string[] }) {
  const message = range.messages[Math.floor(Math.random() * range.messages.length)];

  return {
    title: range.title,
    message,
  };
}
