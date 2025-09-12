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

export default function WriteUpRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { writeups, loading, error } = useSelector((state) => state.writeups);
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    
    useEffect(() => {
        if (writeups.length === 0 && !loading && !error) {
            dispatch(fetchWriteups());
        }
    }, [writeups.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    usePrerenderReady([loading]);
    const writeup = writeups.find((post) => post.Slug === slug);

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav  
                contentsList={writeups}
                currentSlug={slug}
                basePath="/writeups"
            />
        );
    }, [writeups, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />;
    if (!loading && !error && !writeup) return <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />;

    return (
        <div className={style.contentRender.container}>
            <SEO 
                title={`${writeup?.MachineName} CTF Writeup`}
                description={writeup?.Summary || `CTF writeup for ${writeup?.MachineName} by Team Simple`}
                keywords={`CTF, ${writeup?.MachineName}, writeup, hacking, security, ${(writeup?.Tags || []).join(', ')}`}
                ogImage={writeup?.WriteUpImage || '/src/assets/logo.png'}
                canonicalUrl={`${BASE_URL}/writeups/${slug}`}
            >
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={writeup?.DateCreated} />
                <meta property="article:modified_time" content={writeup?.DateModified} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": `${writeup?.MachineName} Writeup`,
                        "description": writeup?.Summary,
                        "image": writeup?.WriteUpImage,
                        "author": {
                            "@type": "Organization",
                            "name": "Team Simple"
                        },
                        "datePublished": writeup?.DateCreated,
                        "dateModified": writeup?.DateModified,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `${BASE_URL}/writeups/${slug}`
                        },
                        "keywords": ["CTF", "cybersecurity", writeup?.MachineName, "writeup", "hacking", "security"]
                    })}
                </script>
            </SEO>
            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={writeup}
                Footer={FooterWithNav}
            />
        </div>
    );
}
