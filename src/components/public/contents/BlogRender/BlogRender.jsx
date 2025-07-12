import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../redux/actions/blogActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './BlogHeader';
import FooterNav from '../FooterNav';
import style from '../../../../app/Style';

export default function BlogRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { blogs, loading, error } = useSelector((state) => state.blogs);

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

    return (
        <div className={style}>
            {loading && <Loading />}
            {!loading && error && <ErrorHandle type="Blog" errorType="public" path='/blogs' />}
            {!loading && !error && !blog && (
                //<ErrorMessage message="Blog post not found" />
                <ErrorHandle type="Blog" errorType="public" path='/blogs' />
            )}
            {!loading && !error && blog && (
                <ContentMDRender
                    key={slug} 
                    Header={Header}
                    Contents={blog}
                    Footer={FooterWithNav}
                />
            )}
        </div>
    );
}


