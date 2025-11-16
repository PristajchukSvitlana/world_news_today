import { useEffect, useMemo, useRef, useState } from "react";
import PROVIDERS, { DEFAULT_API_KEY, DEFAULT_PROVIDER } from "./lib/providers";
import useDebouncedValue from "./hooks/useDebouncedValue";

import Badge from "../src/components/Badge.jsx";
import Spinner from "./components/Spinner.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Modal from "./components/Modal.jsx";
import ArticleCard from "./components/ArticleCard.jsx";
import Pagination from "./components/Pagination.jsx";
import { formatDate } from "../src/utils/formatDate.js";

function useQueryParamsState(defaults) {
  const first = useRef(true);
  const [state, setState] = useState(() => {
    const url = new URL(window.location.href);
    const obj = { ...defaults };
    for (const k of Object.keys(defaults)) {
      const v = url.searchParams.get(k);
      if (v != null) obj[k] = isNaN(defaults[k]) ? v : Number(v);
    }
    return obj;
  });

  useEffect(() => {
    if (!first.current) {
      const url = new URL(window.location.href);
      Object.entries(state).forEach(([k, v]) => {
        if (v == null || v === "") url.searchParams.delete(k);
        else url.searchParams.set(k, String(v));
      });
      window.history.replaceState({}, "", url.toString());
    } else {
      first.current = false;
    }
  }, [state]);

  return [state, setState];
}

export default function App() {
  const [config, setConfig] = useState(() => {
    const url = new URL(window.location.href);
    const urlApiKey = url.searchParams.get("apiKey") || "";
    const envApiKey = import.meta?.env?.VITE_NEWS_API_KEY || "";
    const provider = url.searchParams.get("provider") || DEFAULT_PROVIDER;
    return {
      provider: PROVIDERS[provider] ? provider : DEFAULT_PROVIDER,
      apiKey: urlApiKey || envApiKey || DEFAULT_API_KEY,
    };
  });

  const provider = PROVIDERS[config.provider];

  const [qs, setQs] = useQueryParamsState({
    q: "",
    category: "general",
    country: "us",
    page: 1,
    pageSize: 12,
  });

  const debouncedQ = useDebouncedValue(qs.q, 600);

  const [data, setData] = useState({ total: 0, articles: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / (qs.pageSize || 12))),
    [data.total, qs.pageSize]
  );

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function run() {
      if (!config.apiKey) return;
      setLoading(true);
      setError("");

      try {
        const url = provider.buildUrl({
          apiKey: config.apiKey,
          q: debouncedQ.trim(),
          category: debouncedQ ? undefined : qs.category,
          country: qs.country,
          page: qs.page,
          pageSize: qs.pageSize,
        });

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (ignore) return;
        if (json.status && json.status !== "ok") {
          throw new Error(json.message || "API error");
        }

        const normalized = provider.normalize(json);
        setData(normalized);
      } catch (e) {
        if (ignore) return;
        setError(e?.message || "Unexpected error");
        setData({ total: 0, articles: [] });
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [
    config.apiKey,
    provider,
    debouncedQ,
    qs.category,
    qs.country,
    qs.page,
    qs.pageSize,
  ]);

  const setCategory = (category) => setQs((s) => ({ ...s, page: 1, category }));

  const setCountry = (country) => setQs((s) => ({ ...s, page: 1, country }));

  const onSearchChange = (e) =>
    setQs((s) => ({ ...s, page: 1, q: e.target.value }));

  const switchProvider = () => {
    setConfig((c) => {
      const next = c.provider === "newsapi" ? "gnews" : "newsapi";
      const has = PROVIDERS[next].categories.includes(qs.category)
        ? qs.category
        : "general";
      setQs((s) => ({ ...s, category: has, page: 1 }));
      return { ...c, provider: next };
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header className="header">
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginRight: 8,
            }}
          >
            <span style={{ fontSize: 24 }}>🌍</span>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Новини світу
            </h1>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={switchProvider}>
            Провайдер: <strong>{provider.name}</strong>
          </button>
          <a
            className="btn"
            href="https://newsapi.org/"
            target="_blank"
            rel="noreferrer"
          >
            Документація
          </a>
        </div>
      </header>

      <main className="container" style={{ padding: "24px 0" }}>
        {!config.apiKey && (
          <div
            className="card"
            style={{
              padding: 12,
              borderColor: "#f59e0b",
              background: "#fffbeb",
              color: "#78350f",
            }}
          >
            Додайте API ключ у URL як <code>?apiKey=YOUR_KEY</code> або у Vite
            змінну <code>VITE_NEWS_API_KEY</code>. Інакше додаток
            використовуватиме обмежений загальнодоступний ключ .
          </div>
        )}

        <section className="grid" style={{ gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              value={qs.q}
              onChange={onSearchChange}
              placeholder="Пошук новин…"
            />

            <div style={{ display: "flex", gap: 8 }}>
              <select
                className="select"
                value={qs.country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {provider.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                className="select"
                value={qs.pageSize}
                onChange={(e) =>
                  setQs((s) => ({
                    ...s,
                    pageSize: Number(e.target.value),
                    page: 1,
                  }))
                }
              >
                {[12, 18, 24, 36].map((n) => (
                  <option key={n} value={n}>
                    {n}/стор
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {provider.categories.map((c) => (
              <Badge
                key={c}
                active={qs.category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </Badge>
            ))}
          </div>
        </section>

        <section style={{ minHeight: 200, marginTop: 16 }}>
          {loading ? (
            <Spinner />
          ) : error ? (
            <EmptyState title="Помилка завантаження" subtitle={error} />
          ) : data.articles.length === 0 ? (
            <EmptyState subtitle="Спробуйте інший пошук або категорію." />
          ) : (
            <div
              className="grid"
              style={{
                gap: 16,
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {data.articles.map((a) => (
                <ArticleCard key={a.id} a={a} onOpen={setSelected} />
              ))}
            </div>
          )}
        </section>

        {data.articles.length > 0 && (
          <Pagination
            page={qs.page}
            totalPages={totalPages}
            onPrev={() =>
              setQs((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
            }
            onNext={() => setQs((s) => ({ ...s, page: s.page + 1 }))}
          />
        )}
      </main>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {selected.title}
            </h2>

            {selected.image && (
              <div className="card" style={{ overflow: "hidden" }}>
                <img
                  src={selected.image}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            )}

            <div style={{ fontSize: 14, color: "#6b7280" }}>
              <span>{selected.source}</span>
              {selected.publishedAt && (
                <>
                  <span> • </span>
                  <time>{formatDate(selected.publishedAt)}</time>
                </>
              )}
              {selected.author && (
                <>
                  <span> • </span>
                  <span>Автор: {selected.author}</span>
                </>
              )}
            </div>

            {selected.description && (
              <p style={{ color: "#111827" }}>{selected.description}</p>
            )}
            {selected.content && (
              <p style={{ color: "#111827" }}>{selected.content}</p>
            )}

            <div style={{ paddingTop: 8 }}>
              <a
                className="btn btn-primary"
                href={selected.url}
                target="_blank"
                rel="noreferrer"
              >
                Відкрити джерело ↗
              </a>
            </div>
          </div>
        )}
      </Modal>

      <footer className="footer">
        Зроблено з ❤️ · Джерела: {provider.name}
      </footer>
    </div>
  );
}
