export default function Badge({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={`badge ${active ? "active" : ""}`}>
      {children}
    </button>
  );
}
