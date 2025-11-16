import { formatDate } from "../utils/formatDate";

export default function ArticleCard({ a, onOpen }) {
  return (
    <article
      className="card"
      onClick={() => onOpen(a)}
      style={{ cursor: "pointer" }}
    >
      <div className="aspect-video">
        {a.image ? (
          <img src={a.image} alt={a.title} loading="lazy" />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            📰
          </div>
        )}
      </div>
      <div style={{ padding: 16, display: "grid", gap: 8 }}>
        <h3
          style={{ fontWeight: 600, lineHeight: 1.25 }}
          className="line-clamp-3"
        >
          {a.title}
        </h3>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {a.source && (
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {a.source}
            </span>
          )}
          <span>•</span>
          {a.publishedAt && <time>{formatDate(a.publishedAt)}</time>}
        </div>
        {a.description && (
          <p style={{ color: "#374151" }} className="line-clamp-3">
            {a.description}
          </p>
        )}
        <div style={{ paddingTop: 4 }}>
          <button className="btn">Детальніше</button>
        </div>
      </div>
    </article>
  );
}
