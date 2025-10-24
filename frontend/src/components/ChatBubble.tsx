type Props = { from: 'user' | 'bot'; text: string };

export default function ChatBubble({ from, text }: Props) {
  const base: React.CSSProperties = {
    padding: '0.5rem 0.9rem',
    borderRadius: 14,
    maxWidth: '78%',
    marginBottom: 8,
    alignSelf: from === 'user' ? 'flex-end' : 'flex-start',
    background: from === 'user' ? '#1867C0' : '#f1f1f1',
    color: from === 'user' ? 'white' : 'black',
  };
  return <div style={base}>{text}</div>;
}
