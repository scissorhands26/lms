import React from "react";

function Block({
  label,
  length,
  className,
}: {
  label: string;
  length: number;
  className: string;
}) {
  return (
    <div
      style={{
        gridColumn: `span ${length} / span ${length}`,
      }}
      className={`flex items-center justify-center border border-green-800 text-center ${className}`}
    >
      <div className="">{label}</div>
    </div>
  );
}

function BlockRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-cols-16 grid w-full justify-center gap-0">
      {children}
    </div>
  );
}

export default function BlockDiagram({
  rows,
}: {
  rows: { label: string; length: number; className: string }[][];
}) {
  return (
    <div className="my-5 flex flex-col items-center">
      {rows.map((row, rowIndex) => (
        <BlockRow key={rowIndex}>
          {row.map((block, blockIndex) => (
            <Block
              key={blockIndex}
              label={block.label}
              length={block.length}
              className={block.className}
            />
          ))}
        </BlockRow>
      ))}
    </div>
  );
}
