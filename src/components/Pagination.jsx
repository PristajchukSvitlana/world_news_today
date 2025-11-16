export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingTop: 8,
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280" }}>
        Сторінка <strong>{page}</strong> з {totalPages}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={onPrev} disabled={page <= 1}>
          ← Назад
        </button>
        <button className="btn" onClick={onNext} disabled={page >= totalPages}>
          Далі →
        </button>
      </div>
    </section>
  );
}
