import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWriteups } from '../../redux/actions/writeupActions';
import ContentMDRender from '../ContentMDRender';
import ErrorHandle from '../../ui/ErrorHandle';
import Loading from '../../ui/Loading';
import Header from './WriteUpHeader';
import FooterNav from '../FooterNav';
import style from '../../../../app/Style';

export default function WriteUpRender() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { writeups, loading, error } = useSelector((state) => state.writeups);

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

    return (
        <div className={style}>
            {loading && <Loading />}
            {!loading && error && <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />}
            {!loading && !error && !writeup && (
                <ErrorHandle type="WriteUp" errorType="public" path='/writeups' />
            )}
            {!loading && !error && writeup && (
                <ContentMDRender
                    key={slug}
                    Header={Header}
                    Contents={writeup}
                    Footer={FooterWithNav}
                />
            )}
        </div>
    );
}
