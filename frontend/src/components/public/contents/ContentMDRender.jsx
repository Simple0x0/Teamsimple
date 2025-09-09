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
                        img: ({ node, ...props }) => ( <img className={style.contentmd.img} {...props} /> ),
                        blockquote: ({ node, ...props }) => ( <blockquote className={style.contentmd.blockquote} {...props} /> ),
                        table: ({ node, ...props }) => ( <table className={style.contentmd.table} {...props} /> ),
                        th: ({ node, ...props }) => <th className={style.contentmd.th} {...props} />,
                        td: ({ node, ...props }) => <td className={style.contentmd.td} {...props} />,
                    }}
                />
            </div>

            <Footer />
        </div>
    );
}
