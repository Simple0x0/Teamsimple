// react-snap.config.js
const sitemap = require('./sitemap.json');

module.exports = {
  inlineCss: true,
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  source: 'dist',
  include: ['/', ...sitemap],
};
