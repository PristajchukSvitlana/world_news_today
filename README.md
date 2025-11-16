# world_news_today

A simple React + Vite web application for browsing the latest world news.  
Users can:
- view top headlines,
- filter by category and country,
- search by keyword,
- switch between providers (NewsAPI.org, GNews.io),
- open full articles in a new tab.

 Prerequisites
Node.js >= 18
npm (або pnpm / yarn, якщо бажаєте)
Git;

1.clone the repo:
git clone https://github.com/YOUR_GITHUB_USERNAME/world-news-today.git
cd world-news-today
2. install dependencies:
npm install
3. Add your key:
VITE_NEWS_API_KEY=YOUR_NEWSAPI_KEY_HERE
4. Run the development server:
npm run dev
5. Open the app in your browser (Vite will show the URL, usually):
http://localhost:5173/


Project structure:
src/
  main.jsx         
  App.jsx            

  index.css          
  App.css        

  components/
    Badge.jsx
    Spinner.jsx
    EmptyState.jsx
    Modal.jsx
    ArticleCard.jsx
    Pagination.jsx

  hooks/
    useDebouncedValue.js

  lib/
    providers.js     

  utils/
    formatDate.js

