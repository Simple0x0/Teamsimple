import fs from 'fs'

const sitemap = JSON.parse(fs.readFileSync('./sitemap.json', 'utf-8'))
// return just the paths, e.g. ["/", "/blogs/environment", "/projects/demo"]
export default sitemap.map(url => {
  const u = new URL(url)
  return u.pathname
})
