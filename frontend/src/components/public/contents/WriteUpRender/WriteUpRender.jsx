import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWriteups } from '../../redux/actions/writeupActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './WriteUpHeader';
import FooterNav from '../FooterNav';
import { Helmet } from 'react-helmet-async';
import style from '../../../../app/Style';

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
            <Helmet>
                <title>{writeup?.MachineName} | Team Simple</title>
                <meta name="description" content={`Write-up for ${writeup?.MachineName} on ${writeup?.Platform}`} />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content={writeup?.MachineName} />
                <meta property="og:description" content={`Write-up for ${writeup?.MachineName} on ${writeup?.Platform}`} />
                <meta property="og:image" content={writeup?.WriteUpImage || `src/assets/logo.png`} />
                <meta property="og:url" content={`${BASE_URL}/writeups/${slug}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={writeup?.WriteUpImage || `/src/assets/logo.png`} />
            </Helmet>


            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={writeup}
                Footer={FooterWithNav}
            />
        </div>
    );
}
