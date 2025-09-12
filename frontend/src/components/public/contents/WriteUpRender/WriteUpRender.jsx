import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWriteups } from '../../redux/actions/writeupActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './WriteUpHeader';
import FooterNav from '../FooterNav';
import SEO from '../../../SEO';
import style from '../../../../app/Style';
import { usePrerenderReady } from '../../hook/usePrerenderReady';
import prerenderedWriteups from '../../../../contents/prerendered-writeups.json';

export default function WriteUpRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { writeups, loading, error } = useSelector((state) => state.writeups);
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

    // Fetch Redux writeups if not loaded
    useEffect(() => {
        if (writeups.length === 0 && !loading && !error) {
            dispatch(fetchWriteups());
        }
    }, [writeups.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    usePrerenderReady([loading]);

    // Find writeup in Redux or fallback to prerendered JSON
    const writeup = writeups.find((post) => post.Slug === slug);
    const prerenderWriteup = prerenderedWriteups.find((post) => post.slug === slug);

    // Merge for SEO: prefer prerendered values for meta tags
    const seoData = {
        title: prerenderWriteup?.title || (writeup ? `${writeup.MachineName} Writeup` : 'Writeup'),
        description: prerenderWriteup?.description || writeup?.Summary || `writeup for ${writeup?.MachineName}`,
        ogImage: prerenderWriteup?.ogImage || writeup?.WriteUpImage || '/src/assets/logo.png',
        canonicalUrl: prerenderWriteup?.canonicalUrl || `${BASE_URL}/writeups/${slug}`,
        datePublished: prerenderWriteup?.datePublished || writeup?.DateCreated,
        dateModified: prerenderWriteup?.dateModified || writeup?.DateModified,
        tags: prerenderWriteup?.tags || writeup?.Tags || [],
    };

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav  
                contentsList={writeups.length ? writeups : prerenderedWriteups}
                currentSlug={slug}
                basePath="/writeups"
            />
        );
    }, [writeups, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />;
    if (!loading && !error && !writeup && !prerenderWriteup) return <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />;

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
                        "@type": "TechArticle",
                        "headline": seoData.title,
                        "description": seoData.description,
                        "image": seoData.ogImage,
                        "author": { "@type": "Organization", "name": "Team Simple" },
                        "datePublished": seoData.datePublished,
                        "dateModified": seoData.dateModified,
                        "mainEntityOfPage": { "@type": "WebPage", "@id": seoData.canonicalUrl },
                        "keywords": ["CTF", "cybersecurity", writeup?.MachineName || '', "writeup", "hacking", "security", ...seoData.tags]
                    })}
                </script>
            </SEO>
            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={writeup || prerenderWriteup}
                Footer={FooterWithNav}
            />
        </div>
    );
}
