// components/CodeBlock.jsx
import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import style from '../../../app/Style';

export default function CodeBlock({ language, value }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className={style.mdcontentHeader.copybtn}
            >
                {copied ? 'Copied ✅' : 'Copy'}
            </button>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
}
