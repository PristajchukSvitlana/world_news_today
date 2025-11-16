export default function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: "2px solid #e5e7eb",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
