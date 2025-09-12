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


    // --- Write SEO-rich JSON files for each content type ---
    const contentsDir = path.join(process.cwd(), 'src', 'contents');
    await fs.mkdir(contentsDir, { recursive: true });

    // Helper to extract SEO fields
    const extractSEO = (item, type) => {
      switch(type) {
        case 'blog':
          return {
            slug: item?.Slug,
            title: item?.Title,
            description: item?.Summary,
            ogImage: item?.BlogImage || '/src/assets/logo.png',
            canonicalUrl: `${BASE_URL}/blogs/${item?.Slug}`,
            datePublished: item?.DateCreated,
            dateModified: item?.LastUpdated,
            tags: item?.Tags || [],
          };
        case 'writeup':
          return {
            slug: item?.Slug,
            title: `${item?.MachineName} Writeup`,
            description: item?.Summary || `writeup for ${item?.MachineName}`,
            ogImage: item?.WriteUpImage || '/src/assets/logo.png',
            canonicalUrl: `${BASE_URL}/writeups/${item?.Slug}`,
            datePublished: item?.DateCreated,
            dateModified: item?.DateModified,
            tags: item?.Tags || [],
          };
        case 'project':
          return {
            slug: item?.Slug,
            title: item?.Title,
            description: item?.Description || 'Explore this project on Team Simple',
            ogImage: item?.CoverImage || '/src/assets/logo.png',
            canonicalUrl: `${BASE_URL}/projects/${item?.Slug}`,
            datePublished: item?.DateCreated,
            dateModified: item?.UpdatedAt,
            tags: item?.Tags || [],
            technologies: item?.Technologies || [],
          };
        case 'podcast':
          return {
            slug: item?.Slug,
            title: item?.Title,
            description: item?.Summary,
            ogImage: item?.PodcastImage || '/src/assets/logo.png',
            canonicalUrl: `${BASE_URL}/podcasts/${item?.Slug}`,
            datePublished: item?.DateCreated,
            dateModified: item?.LastUpdated,
            tags: item?.Tags || [],
          };
        default:
          return {};
      }
    };

    await Promise.all([
      fs.writeFile(path.join(contentsDir, 'prerendered-blogs.json'), JSON.stringify(blogs.map(b => extractSEO(b, 'blog')), null, 2), 'utf8'),
      fs.writeFile(path.join(contentsDir, 'prerendered-writeups.json'), JSON.stringify(writeups.map(w => extractSEO(w, 'writeup')), null, 2), 'utf8'),
      fs.writeFile(path.join(contentsDir, 'prerendered-projects.json'), JSON.stringify(projects.map(p => extractSEO(p, 'project')), null, 2), 'utf8'),
      fs.writeFile(path.join(contentsDir, 'prerendered-podcasts.json'), JSON.stringify(podcasts.map(pc => extractSEO(pc, 'podcast')), null, 2), 'utf8'),
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
