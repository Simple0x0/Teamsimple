import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkSubSuper from 'remark-supersub';
import CodeBlock from './CodeBlock';
import style from '../../../app/Style';

export default function ContentMDRender({ Header, Contents, Footer }) {
    const markdown = Contents.Content;

    const [modalImg, setModalImg] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const openModal = (src) => {
        setModalImg(src);
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => setModalImg(null), 300); // wait for animation to finish
    };

    return (
        <div className={style.contentmd.container}>
            <Header contents={Contents} />

            <div className={style.contentmd.body}>
                <ReactMarkdown
                    children={markdown}
                    remarkPlugins={[remarkGfm, remarkEmoji, remarkSubSuper]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');

                            if (!inline && match) {
                                return (
                                    <CodeBlock language={match[1]} value={codeString} />
                                );
                            } else {
                                return (
                                    <code className={style.contentmd.inlineCode} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        },
                        h1: ({ node, ...props }) => <h1 className={style.contentmd.h1} {...props} />,
                        h2: ({ node, ...props }) => <h2 className={style.contentmd.h2} {...props} />,
                        h3: ({ node, ...props }) => <h2 className={style.contentmd.h3} {...props} />,
                        h4: ({ node, ...props }) => <h2 className={style.contentmd.h4} {...props} />,
                        h5: ({ node, ...props }) => <h2 className={style.contentmd.h5} {...props} />,
                        h6: ({ node, ...props }) => <h2 className={style.contentmd.h6} {...props} />,
                        p: ({ node, ...props }) => <p className={style.contentmd.paragraph} {...props} />,
                        ul: ({ node, ...props }) => <ul className={style.contentmd.list} {...props} />,
                        li: ({ node, ...props }) => <li className={style.contentmd.listItem} {...props} />,
                        hr: ({ node, ...props }) => <hr className={style.contentmd.hr} {...props} />,
                        a: ({ node, ...props }) => ( <a className={style.contentmd.link} target="_blank" rel="noopener noreferrer" {...props} /> ),
                        img: ({ node, ...props }) => ( <img
                            {...props}
                            className="rounded-xl shadow-md mx-auto my-4 md:w-4/5 w-full 
                                    cursor-zoom-in transition-transform duration-300 ease-in-out 
                                    hover:scale-105"
                            onClick={() => openModal(props.src)}
                            alt={props.alt || 'Markdown Image'}
                        /> ),
                        blockquote: ({ node, ...props }) => ( <blockquote className={style.contentmd.blockquote} {...props} /> ),
                        table: ({ node, ...props }) => ( <table className={style.contentmd.table} {...props} /> ),
                        th: ({ node, ...props }) => <th className={style.contentmd.th} {...props} />,
                        td: ({ node, ...props }) => <td className={style.contentmd.td} {...props} />,
                    }}
                />
            </div>
            {/* Modal for fullscreen image */}
            {modalImg && (
                <div
                    onClick={closeModal}
                    className={`fixed inset-0 z-50 flex items-center justify-center 
                                bg-slate-800/50 bg-opacity-60 backdrop-blur-sm cursor-zoom-out transition-opacity duration-300`}
                >
                    <img
                        src={modalImg}
                        alt="Zoomed"
                        className={`rounded-lg shadow-lg transition-transform duration-300 ease-in-out 
                                    max-h-[90vh] max-w-[90vw] transform scale-95 ${isVisible ? 'scale-100' : 'scale-95'}`}
                    />
                </div>
            )}
            <Footer />
        </div>
    );
}
