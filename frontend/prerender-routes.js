import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function fetchContentRoutes() {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = process.env.VITE_APP_BASE_URL || 'https://teamsimple.net';

  // Core routes that should always be prerendered
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
    // ✅ Fetch with timeout & safe fallbacks
    const [blogs, writeups, projects, podcasts] = await Promise.all([
      axios.get(`${API_URL}/blogs`, { timeout: 10000 }).then(r => r.data.Blogs || []).catch(() => []),
      axios.get(`${API_URL}/writeups`, { timeout: 10000 }).then(r => r.data.WriteUps || []).catch(() => []),
      axios.get(`${API_URL}/projects`, { timeout: 10000 }).then(r => r.data.Projects || []).catch(() => []),
      axios.get(`${API_URL}/podcasts`, { timeout: 10000 }).then(r => r.data.Podcasts || []).catch(() => []),
    ]);

    // ✅ Always guard against missing `.Slug`
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

    // ✅ Deduplicate & sort for stable builds
    const uniqueRoutes = [...new Set(allRoutes)].sort();

    // ✅ Generate sitemap.xml
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD only
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

    // ✅ Ensure `public` folder exists before writing
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

    return uniqueRoutes;
  } catch (error) {
    console.error('❌ Error fetching routes:', error.message);
    return coreRoutes; // ✅ fallback still returned
  }
}

export { fetchContentRoutes };
