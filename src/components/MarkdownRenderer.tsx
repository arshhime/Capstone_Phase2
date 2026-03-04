import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl">
                            <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between border-b border-zinc-700">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{match[1]}</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                                </div>
                            </div>
                            <SyntaxHighlighter
                                language={match[1]}
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    fontSize: '0.875rem',
                                    background: '#09090b', // zinc-950
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-zinc-800 text-violet-400 px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props}>
                            {children}
                        </code>
                    );
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white border-l-4 border-violet-600 pl-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-white flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-violet-500/50 rounded-full"></span>
                    {children}
                </h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-4 mb-2 text-zinc-400 uppercase tracking-[0.2em]">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-zinc-300 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2 text-zinc-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2 text-zinc-300">{children}</ol>,
                li: ({ children }) => <li className="pl-2">{children}</li>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-500 my-4 bg-zinc-900/30 py-2 rounded-r-lg">
                        {children}
                    </blockquote>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
