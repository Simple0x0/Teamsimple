import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/actions/projectActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './ProjectHeader';
import FooterNav from '../FooterNav';
import style from '../../../../app/Style';

export default function ProjectRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);

    useEffect(() => {
        if (projects.length === 0 && !loading && !error) {
            dispatch(fetchProjects());
        }
    }, [projects.length, loading, error, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

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

    return (
        <div className={style}>
            {loading && <Loading />}
            {!loading && error && <ErrorHandle type="Project" errorType="public" path='/projects' />}
            {!loading && !error && !project && (
                <ErrorHandle type="Project" errorType="public" path='/projects' />
            )}
            {!loading && !error && project && (
                <ContentMDRender
                    key={slug}
                    Header={Header}
                    Contents={project}
                    Footer={FooterWithNav}
                />
            )}
        </div>
    );
}
