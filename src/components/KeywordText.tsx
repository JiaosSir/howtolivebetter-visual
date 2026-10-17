import { highlightParts } from '../lib/search';

interface KeywordTextProps {
  text: string;
  terms?: string[];
}

export default function KeywordText({ text, terms }: KeywordTextProps) {
  if (!terms || terms.length === 0) return <>{text}</>;

  return (
    <>
      {highlightParts(text, terms).map((part, index) =>
        part.match ? (
          <mark key={index} className="search-keyword-flash">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
