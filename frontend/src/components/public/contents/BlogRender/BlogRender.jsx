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

export default function BlogRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { blogs, loading, error } = useSelector((state) => state.blogs);
    const BASE_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        if (blogs.length === 0 && !loading && !error) {
            dispatch(fetchBlogs());
        }
    }, [blogs.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);
    
    usePrerenderReady([loading]);
    const blog = blogs.find((post) => post.Slug === slug);

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav
                contentsList={blogs}
                currentSlug={slug}
                basePath="/blogs"
            />
        );
    }, [blogs, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="Blog" errorType="public" path='/blogs' />;
    if (!loading && !error && !blog) return <ErrorHandle type="Blog" errorType="public" path='/blogs' />;

    return (
        <div className={style}>
            <SEO 
                title={blog?.Title}
                description={blog?.Summary}
                // keywords={blog?.Tags?.join(', ')}
                ogImage={blog?.BlogImage || '/src/assets/logo.png'} 
                canonicalUrl={`${BASE_URL}/blogs/${slug}`}
            >
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={blog?.DateCreated} />
                <meta property="article:modified_time" content={blog?.LastUpdated} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blog?.Title,
                        "description": blog?.Summary,
                        "image": blog?.BlogImage,
                        "author": {
                            "@type": "Organization",
                            "name": "Team Simple"
                        },
                        "datePublished": blog?.DateCreated,
                        "dateModified": blog?.LastUpdated,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `${BASE_URL}/blogs/${slug}`
                        }
                    })}
                </script>
            </SEO>
            <ContentMDRender
                key={slug} 
                Header={Header}
                Contents={blog}
                Footer={FooterWithNav}
            />
        </div>
    );
}
