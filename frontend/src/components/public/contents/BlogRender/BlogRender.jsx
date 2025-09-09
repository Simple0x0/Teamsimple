import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../redux/actions/blogActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './BlogHeader';
import FooterNav from '../FooterNav';
import { Helmet } from 'react-helmet-async';
import style from '../../../../app/Style';

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
            <Helmet>
            <title>{blog?.Title} | Team Simple</title>
            <meta name="description" content={blog?.Summary || "Read this blog on Team Simple"} />

            {/* Open Graph / Facebook */}
            <meta property="og:title" content={blog?.Title} />
            <meta property="og:description" content={blog?.Summary || "Read this blog on Team Simple"} />
            <meta property="og:image" content={blog?.BlogImage || "/src/assets/logo.png"} />
            <meta property="og:url" content={`${BASE_URL}/blogs/${slug}`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={blog?.BlogImage || "https://teamsimple.net/assets/logo.png"} />
            </Helmet>


            <ContentMDRender
                key={slug} 
                Header={Header}
                Contents={blog}
                Footer={FooterWithNav}
            />
        </div>
    );
}
