import React from "react";

function Block({
  label,
  length,
  description,
  className,
}: {
  label: string;
  description: string;
  length: number;
  className: string;
}) {
  return (
    <div
      style={{
        gridColumn: `span ${length} / span ${length}`,
      }}
      className={`flex items-center justify-center border border-black text-center text-black dark:text-white ${className}`}
    >
      <div className="flex flex-col">
        <div>{label}</div>
        <div className="text-xs">({description})</div>
      </div>
    </div>
  );
}

function BlockRow({ children, colCount }: { children: any; colCount: number }) {
  return (
    <div className={`grid grid-cols-${colCount} w-full justify-center`}>
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
  }[][];
  colCount?: number;
}) {
  return (
    <div className="my-5 flex flex-col items-center border border-black text-sm">
      {rows.map((row, rowIndex) => (
        <BlockRow key={rowIndex} colCount={colCount}>
          {row.map((block, blockIndex) => (
            <Block
              key={blockIndex}
              label={block.label}
              description={block.description}
              length={block.length}
              className={block.className}
            />
          ))}
        </BlockRow>
      ))}
    </div>
  );
}
