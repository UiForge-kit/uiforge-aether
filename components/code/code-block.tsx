"use client";

import { Highlight } from "prism-react-renderer";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { CODE_THEME, prismLanguage } from "@/config/code-theme";
import { useCopy } from "@/hooks/use-copy";
import { languageLabel } from "@/lib/canvas";
import { cn } from "@/lib/utils";

// sync highlighting on purpose: an async highlighter flickers the block on
// every streamed chunk
export function CodeBlock({
  code,
  language,
  className,
  showHeader = false,
}: {
  code: string;
  language: string;
  className?: string;
  showHeader?: boolean;
}) {
  const { copied, copy } = useCopy();

  return (
    <div className={cn("group/code border-border relative rounded-lg border", className)}>
      {showHeader && (
        <div className="border-border text-muted-foreground border-b px-3 py-1.5 text-[0.6875rem]">
          {languageLabel(language)}
        </div>
      )}

      <button
        type="button"
        onClick={() => void copy(code)}
        aria-label="Copier le code"
        className="bg-surface/90 border-border text-muted-foreground hover:text-foreground absolute top-2 right-2 z-10 rounded-md border p-1.5 opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
      >
        <Icon icon={copied ? Tick02Icon : Copy01Icon} size={13} />
      </button>

      <Highlight code={code} language={prismLanguage(language)} theme={CODE_THEME}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="scrollbar-slim overflow-x-auto p-3.5 font-mono text-[0.8125rem] leading-relaxed"
            style={style}
          >
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={lineIndex} {...lineProps}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
