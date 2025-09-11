import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to fetch data from API
async function fetchContentRoutes() {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = process.env.VITE_APP_BASE_URL || 'https://teamsimple.net';
  
  try {
    // Fetch all content types in parallel
    const [blogs, writeups, projects, podcasts] = await Promise.all([
      axios.get(`${API_URL}/blogs`).catch(() => ({ data: { Blogs: [] } })),
      axios.get(`${API_URL}/writeups`).catch(() => ({ data: { WriteUps: [] } })),
      axios.get(`${API_URL}/projects`).catch(() => ({ data: { Projects: [] } })),
      axios.get(`${API_URL}/podcasts`).catch(() => ({ data: { Podcasts: [] } }))
    ]);

    // Generate routes for each content type
    const blogRoutes = blogs.data.Blogs?.map(blog => `/blogs/${blog.Slug}`) || [];
    const writeupRoutes = writeups.data.WriteUps?.map(writeup => `/writeups/${writeup.Slug}`) || [];
    const projectRoutes = projects.data.Projects?.map(project => `/projects/${project.Slug}`) || [];
    const podcastRoutes = podcasts.data.Podcasts?.map(podcast => `/podcasts/${podcast.Slug}`) || [];

    // Core routes that should always be prerendered
    const coreRoutes = [
      '/',
      '/blogs',
      '/writeups',
      '/projects',
      '/podcasts',
      '/about',
      '/contact',
      '/team'
    ];

    // Combine all routes
    const allRoutes = [
      ...coreRoutes,
      ...blogRoutes,
      ...writeupRoutes,
      ...projectRoutes,
      ...podcastRoutes
    ];

    // Remove duplicates
    const uniqueRoutes = [...new Set(allRoutes)];

    // Generate sitemap.xml
    const today = new Date().toISOString();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    uniqueRoutes.forEach((route) => {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}${route}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      // Give higher priority to main pages
      const priority = route === '/' ? '1.0' : 
                      coreRoutes.includes(route) ? '0.8' : '0.6';
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';

    // Write sitemap.xml to public directory
    await fs.writeFile(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      xml
    );

    // Return routes for prerendering
    return uniqueRoutes;
  } catch (error) {
    console.error('Error fetching routes:', error);
    // Fallback to core routes if API fails
    const fallbackRoutes = [
      '/',
      '/blogs',
      '/writeups',
      '/projects',
      '/podcasts',
      '/about',
      '/contact',
      '/team'
    ];
  }
}

// Export the routes
export default await fetchContentRoutes();
