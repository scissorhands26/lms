import React from "react";

function Block({
  label,
  length,
  description,
  className,
  link,
}: {
  label: string;
  description: string;
  length: number;
  className: string;
  link?: string;
}) {
  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{
        gridColumn: `span ${length} / span ${length}`,
        ...(label === "Break" ? { writingMode: "vertical-rl" } : {}),
      }}
      className={`flex items-center justify-center border border-black text-center text-black dark:text-white ${className} rounded-none hover:opacity-80`}
    >
      <div className="flex flex-col">
        <div>{label}</div>
        {description ? <div className="text-xs">{description}</div> : null}
      </div>
    </a>
  ) : (
    <div
      style={{
        gridColumn: `span ${length} / span ${length}`,
        ...(label === "Break" ? { writingMode: "vertical-rl" } : {}),
      }}
      className={`flex items-center justify-center border border-black text-center text-black dark:text-white ${className}`}
    >
      <div className="flex flex-col">
        <div>{label}</div>
        {description ? <div className="text-xs">{description}</div> : null}
      </div>
    </div>
  );
}

function BlockRow({ children, colCount }: { children: any; colCount: number }) {
  return (
    <div
      style={{
        gridColumn: `span ${colCount} / span ${colCount}`,

        gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
      }}
      className={`grid w-full justify-center`}
    >
      {children}
    </div>
  );
}

export default function BlockDiagram({
  rows,
  colCount = 32,
}: {
  rows: {
    label: string;
    description: string;
    length: number;
    className: string;
    link: string;
  }[][];
  colCount?: number;
}) {
  return (
    <div className="my-5 flex w-full flex-col items-center border border-black text-sm">
      {rows.map((row, rowIndex) => (
        <BlockRow key={rowIndex} colCount={colCount}>
          {row.map((block, blockIndex) => (
            <Block
              key={blockIndex}
              label={block.label}
              description={block.description}
              length={block.length}
              className={block.className}
              link={block.link}
            />
          ))}
        </BlockRow>
      ))}
    </div>
  );
}
