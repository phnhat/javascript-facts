export default function HighlightedText({ text, highlights }){
  if (!highlights || highlights.length === 0) return <h1>{text}</h1>;

  const regex = new RegExp(
    `(${highlights.sort((a, b) => b.length - a.length).map(h => escapeRegExp(h)).join("|")})`,
    "gi"
  );

  const parts = text.split(regex);

  return (
    <h1>
      {parts.map((part, i) =>
        highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      )}
    </h1>
  );
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}