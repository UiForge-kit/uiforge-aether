"use client";

import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code/code-block";

// memoized on the text: the parent renders on every chunk, and reparsing the
// whole document each time makes streaming choppy

function toText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return toText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

const COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-3 leading-[1.7] last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => (
    <h3 className="font-display mt-5 mb-2 text-base font-semibold first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="font-display mt-5 mb-2 text-base font-semibold first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-4 mb-1.5 text-[0.9375rem] font-semibold first:mt-0">{children}</h4>
  ),
  ul: ({ children }) => <ul className="mb-3 space-y-1.5 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="marker:text-muted-foreground leading-[1.65]">{children}</li>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-brand underline decoration-current/35 underline-offset-2 hover:decoration-current"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-border text-muted-foreground my-3 border-l-2 pl-3.5 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-5" />,
  code: ({ className, children }) => {
    const language = /language-(\w+)/.exec(className ?? "")?.[1];
    if (!language) {
      return (
        <code className="bg-muted rounded-[0.3em] px-[0.35em] py-[0.15em] font-mono text-[0.85em]">
          {children}
        </code>
      );
    }
    return (
      <CodeBlock
        code={toText(children).replace(/\n$/, "")}
        language={language}
        className="bg-muted/50 my-3"
      />
    );
  },
  // `code` already renders the full block, a transparent <pre> avoids two nested frames
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="scrollbar-slim border-border my-3 overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-[0.8125rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-muted/60 border-border border-b px-3 py-2 font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border-border border-b px-3 py-2 last:border-0">{children}</td>,
};

export const Markdown = memo(function Markdown({ content }: { content: string }) {
  return (
    <div className="text-[0.9375rem]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
