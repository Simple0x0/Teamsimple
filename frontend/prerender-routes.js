import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// fetchContentRoutes.js
async function fetchContentRoutes() {
  const API_URL = 'https://teamsimple.net/api';
  const BASE_URL = 'https://teamsimple.net';

  const coreRoutes = [
    '/',
    '/blogs',
    '/writeups',
    '/projects',
    '/podcasts',
    '/about',
    '/contact',
    '/team',
  ];

  try {
    const safeFetch = async (url, label) => {
      try {
        const res = await axios.get(url, { timeout: 10000 });
        console.log(`✅ ${label} fetched:`, res.data?.[label]?.length ?? 0 );
        return res.data?.[label] || [];
      } catch (err) {
        console.error(`❌ Failed to fetch ${label}:`, err.message);
        return [];
      }
    };

    const [blogs, writeups, projects, podcasts] = await Promise.all([
      safeFetch(`${API_URL}/blogs`, "Blogs"),
      safeFetch(`${API_URL}/writeups`, "Writeups"),
      safeFetch(`${API_URL}/projects`, "Projects"),
      safeFetch(`${API_URL}/podcasts`, "Podcasts"),
    ]);

    const blogRoutes = blogs.map(b => b?.Slug ? `/blogs/${b.Slug}` : []).filter(Boolean);
    const writeupRoutes = writeups.map(w => w?.Slug ? `/writeups/${w.Slug}` : []).filter(Boolean);
    const projectRoutes = projects.map(p => p?.Slug ? `/projects/${p.Slug}` : []).filter(Boolean);
    const podcastRoutes = podcasts.map(pc => pc?.Slug ? `/podcasts/${pc.Slug}` : []).filter(Boolean);

    const allRoutes = [
      ...coreRoutes,
      ...blogRoutes,
      ...writeupRoutes,
      ...projectRoutes,
      ...podcastRoutes,
    ];

    const uniqueRoutes = [...new Set(allRoutes)].sort();

    console.log("📌 Final route count:", uniqueRoutes.length);
    console.log("📌 Sample routes:", uniqueRoutes.slice(0, 10));

    // --- sitemap.xml generation stays same ---
    const today = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${uniqueRoutes
        .map((route) => {
          const priority = route === '/' ? '1.0' : coreRoutes.includes(route) ? '0.8' : '0.6';
          return `  <url>
          <loc>${BASE_URL}${route}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${priority}</priority>
        </url>`;
        })
        .join('\n')}
      </urlset>`;

    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

    return uniqueRoutes;
  } catch (error) {
    console.error('❌ Unhandled error fetching routes:', error);
    return coreRoutes;
  }
}


export { fetchContentRoutes };
