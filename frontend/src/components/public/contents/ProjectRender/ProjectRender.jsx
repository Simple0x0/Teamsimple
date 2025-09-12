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
import prerenderedProjects from '../../../../contents/prerendered-projects.json';

export default function ProjectRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

    // Fetch Redux projects if not loaded
    useEffect(() => {
        if (projects.length === 0 && !loading && !error) {
            dispatch(fetchProjects());
        }
    }, [projects.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    usePrerenderReady([loading]);

    // Find project in Redux or fallback to prerendered JSON
    const project = projects.find((post) => post.Slug === slug);
    const prerenderProject = prerenderedProjects.find((p) => p.slug === slug);

    const seoData = {
        title: prerenderProject?.title || project?.Title || 'Project',
        description: prerenderProject?.description || project?.Description || 'Explore this project on Team Simple',
        ogImage: prerenderProject?.ogImage || project?.CoverImage || '/src/assets/logo.png',
        canonicalUrl: prerenderProject?.canonicalUrl || `${BASE_URL}/projects/${slug}`,
        datePublished: prerenderProject?.datePublished || project?.DateCreated,
        dateModified: prerenderProject?.dateModified || project?.UpdatedAt,
        tags: prerenderProject?.tags || project?.Tags || [],
        technologies: prerenderProject?.technologies || project?.Technologies || [],
        progress: project?.ProgressPercentage || 0,
    };

    const FooterWithNav = useMemo(() => {
        return () => (
            <FooterNav
                contentsList={projects.length ? projects : prerenderedProjects}
                currentSlug={slug}
                basePath="/projects"
            />
        );
    }, [projects, slug]);

    if (loading) return <Loading />;
    if (!loading && error) return <ErrorHandle type="Project" errorType="public" path='/projects' />;
    if (!loading && !error && !project && !prerenderProject) return <ErrorHandle type="Project" errorType="public" path='/projects' />;

    return (
        <div className={style.contentRender.container}>
            <SEO 
                title={seoData.title}
                description={seoData.description}
                ogImage={seoData.ogImage}
                canonicalUrl={seoData.canonicalUrl}
            >
                <meta property="og:type" content="website" />
                <meta property="article:published_time" content={seoData.datePublished} />
                <meta property="article:modified_time" content={seoData.dateModified} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareSourceCode",
                        "name": seoData.title,
                        "description": seoData.description,
                        "image": seoData.ogImage,
                        "author": { "@type": "Organization", "name": "Team Simple" },
                        "datePublished": seoData.datePublished,
                        "dateModified": seoData.dateModified,
                        "ProgressPercentage": `${seoData.progress} %`,
                        "applicationCategory": "Security",
                        "mainEntityOfPage": { "@type": "WebPage", "@id": seoData.canonicalUrl },
                        "keywords": [...seoData.tags, ...seoData.technologies]
                    })}
                </script>
            </SEO>

            <ContentMDRender
                key={slug}
                Header={Header}
                Contents={project || prerenderProject}
                Footer={FooterWithNav}
            />
        </div>
    );
}
