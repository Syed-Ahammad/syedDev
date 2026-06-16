import { Fragment, type ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;
  const parts = text.split(pattern);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyPrefix}-i${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={key}>{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("_") && part.endsWith("_")) {
      nodes.push(<em key={key}>{part.slice(1, -1)}</em>);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-coral"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<Fragment key={key}>{part}</Fragment>);
    }
  });
  return nodes;
}

export function renderMarkdown(source: string): ReactNode {
  const blocks: ReactNode[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let blockIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={`b${blockIndex}`}
          className="my-6 overflow-x-auto rounded-2xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-foreground"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      blockIndex += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`b${blockIndex}`}
          className="mt-10 mb-3 font-display text-xl font-semibold text-foreground"
        >
          {renderInline(line.slice(4), `b${blockIndex}`)}
        </h3>,
      );
      blockIndex += 1;
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`b${blockIndex}`}
          className="mt-12 mb-4 font-display text-2xl font-semibold text-foreground md:text-3xl"
        >
          {renderInline(line.slice(3), `b${blockIndex}`)}
        </h2>,
      );
      blockIndex += 1;
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <ul
          key={`b${blockIndex}`}
          className="my-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-muted"
        >
          {items.map((item, j) => (
            <li key={j}>{renderInline(item, `b${blockIndex}-li${j}`)}</li>
          ))}
        </ul>,
      );
      blockIndex += 1;
      continue;
    }

    const paragraphLines: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("```")
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p
        key={`b${blockIndex}`}
        className="my-5 text-base leading-relaxed text-muted"
      >
        {renderInline(paragraphLines.join(" "), `b${blockIndex}`)}
      </p>,
    );
    blockIndex += 1;
  }

  return <>{blocks}</>;
}
