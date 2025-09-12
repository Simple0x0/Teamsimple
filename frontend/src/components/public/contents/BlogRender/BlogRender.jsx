import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../redux/actions/blogActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './BlogHeader';
import FooterNav from '../FooterNav';
import SEO from '../../../SEO';
import style from '../../../../app/Style';
import { usePrerenderReady } from '../../hook/usePrerenderReady';
import prerenderedBlogs from '../../../../contents/prerendered-blogs.json';

export default function BlogRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { blogs, loading, error } = useSelector((state) => state.blogs);
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

    // Fetch Redux blogs if not loaded
    useEffect(() => {
        if (blogs.length === 0 && !loading && !error) {
            dispatch(fetchBlogs());
        }
    }, [blogs.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    usePrerenderReady([loading]);

    // Find blog in Redux or fallback to prerendered JSON
    const blog = blogs.find((post) => post.Slug === slug);
    const prerenderBlog = prerenderedBlogs.find((post) => post.slug === slug);

    // Merge SEO data
    const seoData = {
        title: prerenderBlog?.title || blog?.Title || 'Blog',
        description: prerenderBlog?.description || blog?.Summary || '',
        ogImage: prerenderBlog?.ogImage || blog?.BlogImage || '/src/assets/logo.png',
        canonicalUrl: prerenderBlog?.canonicalUrl || `${BASE_URL}/blogs/${slug}`,
        datePublished: prerenderBlog?.datePublished || blog?.DateCreated,
        dateModified: prerenderBlog?.dateModified || blog?.LastUpdated,
        tags: prerenderBlog?.tags || blog?.Tags || [],
    };

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav
                contentsList={blogs.length ? blogs : prerenderedBlogs}
                currentSlug={slug}
                basePath="/blogs"
            />
        );
    }, [blogs, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="Blog" errorType="public" path='/blogs' />;
    if (!loading && !error && !blog && !prerenderBlog) return <ErrorHandle type="Blog" errorType="public" path='/blogs' />;

    return (
        <div className={style.contentRender.container}>
            <SEO 
                title={seoData.title}
                description={seoData.description}
                ogImage={seoData.ogImage}
                canonicalUrl={seoData.canonicalUrl}
            >
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={seoData.datePublished} />
                <meta property="article:modified_time" content={seoData.dateModified} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": seoData.title,
                        "description": seoData.description,
                        "image": seoData.ogImage,
                        "author": { "@type": "Organization", "name": "Team Simple" },
                        "datePublished": seoData.datePublished,
                        "dateModified": seoData.dateModified,
                        "mainEntityOfPage": { "@type": "WebPage", "@id": seoData.canonicalUrl },
                        "keywords": seoData.tags
                    })}
                </script>
            </SEO>
            <ContentMDRender
                key={slug} 
                Header={Header}
                Contents={blog || prerenderBlog}
                Footer={FooterWithNav}
            />
        </div>
    );
}
