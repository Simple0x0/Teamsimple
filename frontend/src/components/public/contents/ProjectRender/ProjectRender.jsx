import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/actions/projectActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './ProjectHeader';
import FooterNav from '../FooterNav';
import SEO from '../../../SEO';
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
            <SEO 
                title={project?.Title}
                description={project?.Description || "Explore this project on Team Simple"}
                //keywords={`${Array.isArray(project?.Technologies) ? project?.Technologies?.join(', ') : ''}, cybersecurity, ${Array.isArray(project?.Tags) ? project?.Tags?.join(', ') : ''}`}
                ogImage={project?.CoverImage || '/src/assets/logo.png'}
                canonicalUrl={`${BASE_URL}/projects/${slug}`}
            >
                <meta property="og:type" content="website" />
                <meta property="article:published_time" content={project?.DateCreated} />
                <meta property="article:modified_time" content={project?.UpdatedAt} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareSourceCode",
                        "name": project?.Title,
                        "description": project?.Description,
                        "image": project?.CoverImage,
                        "author": {
                            "@type": "Organization",
                            "name": "Team Simple"
                        },
                        "datePublished": project?.DateCreated,
                        "dateModified": project?.UpdatedAt,
                        "ProgressPercentage": `${project?.ProgressPercentage} %`,
                        "applicationCategory": "Security",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `${BASE_URL}/projects/${slug}`
                        }
                    })}
                </script>
            </SEO>

            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={project}
                Footer={FooterWithNav}
            />
        </div>
    );
}
