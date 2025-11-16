
const PROVIDERS = {
    newsapi: {
        id: 'newsapi',
        name: 'NewsAPI.org',
        base: 'https://newsapi.org/v2',
        categories: ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'],
        countries: [
            { code: 'us', label: 'United States' },
            { code: 'gb', label: 'United Kingdom' },
            { code: 'de', label: 'Germany' },
            { code: 'fr', label: 'France' },
            { code: 'it', label: 'Italy' },
            { code: 'ua', label: 'Ukraine' },
            { code: 'pl', label: 'Poland' },
            { code: 'ca', label: 'Canada' },
            { code: 'au', label: 'Australia' },
            { code: 'in', label: 'India' }
        ],
        buildUrl: ({ apiKey, q, category, country, page, pageSize }) => {
            const params = new URLSearchParams();

            if (q) {

                params.set('q', q);
            } else {

                if (category) params.set('category', category);
                if (country) params.set('country', country);
            }

            params.set('page', String(page || 1));
            params.set('pageSize', String(pageSize || 12));
            params.set('apiKey', apiKey);

            const endpoint = q ? '/everything' : '/top-headlines';
            return `${PROVIDERS.newsapi.base}${endpoint}?${params.toString()}`;
        },

        normalize: (json) => {
            const total = json?.totalResults ?? 0;
            const articles = (json?.articles || []).map((a) => ({
                id: `${a.source?.id || a.source?.name || 'src'}-${a.publishedAt}-${a.title}`,
                title: a.title,
                description: a.description,
                content: a.content,
                url: a.url,
                image: a.urlToImage,
                source: a.source?.name,
                author: a.author,
                publishedAt: a.publishedAt,
            }));
            return { total, articles };
        }
    },
    gnews: {
        id: 'gnews',
        name: 'GNews.io',
        base: 'https://gnews.io/api/v4',
        categories: ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'],
        countries: [
            { code: 'us', label: 'United States' },
            { code: 'gb', label: 'United Kingdom' },
            { code: 'de', label: 'Germany' },
            { code: 'fr', label: 'France' },
            { code: 'it', label: 'Italy' },
            { code: 'ua', label: 'Ukraine' },
            { code: 'pl', label: 'Poland' },
            { code: 'ca', label: 'Canada' },
            { code: 'au', label: 'Australia' },
            { code: 'in', label: 'India' }
        ],
        buildUrl: ({ apiKey, q, category, country, page, pageSize }) => {
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (category) params.set('topic', category);
            if (country) params.set('country', country);
            params.set('page', String(page || 1));
            params.set('max', String(pageSize || 12));
            params.set('apikey', apiKey);
            const endpoint = q ? '/search' : '/top-headlines';
            return `${PROVIDERS.gnews.base}${endpoint}?${params.toString()}`;
        },
        normalize: (json) => {
            const total = json?.totalArticles ?? 0;
            const articles = (json?.articles || []).map((a) => ({
                id: `${a.source?.id || a.source?.name || 'src'}-${a.publishedAt}-${a.title}`,
                title: a.title,
                description: a.description,
                content: a.content,
                url: a.url,
                image: a.image,
                source: a.source?.name,
                author: a.author,
                publishedAt: a.publishedAt,
            }));
            return { total, articles };
        }
    }
};
export const DEFAULT_PROVIDER = 'newsapi';
export const DEFAULT_API_KEY = '83c5e6e283544edb8b77847ef9bab535';
export default PROVIDERS;    