import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/actions/projectActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './ProjectHeader';
import FooterNav from '../FooterNav';
import { Helmet } from 'react-helmet-async';
import style from '../../../../app/Style';
import { usePrerenderReady } from '../../hook/usePrerenderReady';

export default function ProjectRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL; // environment-based base URL

    useEffect(() => {
        if (projects.length === 0 && !loading && !error) {
            dispatch(fetchProjects());
        }
    }, [projects.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    usePrerenderReady([loading]);
    const project = projects.find((post) => post.Slug === slug);

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav
                contentsList={projects}
                currentSlug={slug}
                basePath="/projects"
            />
        );
    }, [projects, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="Project" errorType="public" path='/projects' />;
    if (!loading && !error && !project) return <ErrorHandle type="Project" errorType="public" path='/projects' />;

    return (
        <div className={style}>
            <Helmet>
                <title>{project?.Title} | Team Simple</title>
                <meta name="description" content={project?.Description || "Explore this project on Team Simple"} />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content={project?.Title} />
                <meta property="og:description" content={project?.Description || "Explore this project on Team Simple"} />
                <meta property="og:image" content={project?.CoverImage || `${BASE_URL}/src/assets/logo.png`} />
                <meta property="og:url" content={`${BASE_URL}/projects/${slug}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={project?.CoverImage || `${BASE_URL}/src/assets/logo.png`} />
            </Helmet>

            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={project}
                Footer={FooterWithNav}
            />
        </div>
    );
}
