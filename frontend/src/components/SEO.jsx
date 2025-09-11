import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, ogImage, canonicalUrl, children }) => {
  const siteName = 'Team Simple';
  const defaultDescription = 'Team Simple - Cybersecurity Research and Training';
  const defaultKeywords = 'cybersecurity, research, training, ethical hacking, penetration testing';
  const defaultOgImage = '/src/assets/logo.png';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Additional Meta Tags */}
      {children}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
  children: PropTypes.node
};

export default SEO;
