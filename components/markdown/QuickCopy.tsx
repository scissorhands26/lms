import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function CodeBlockWithCopy({
  snippet,
  title,
}: {
  snippet: string;
  title: string;
}) {
  function copyToClipboard() {
    navigator.clipboard.writeText(snippet).then(() => {
      toast(`Copied ${title} to Clipboard!`, {
        description: `${snippet}`,
        action: {
          label: "Undo",
          onClick: () => navigator.clipboard.writeText(""),
        },
      });
    });
  }

  return (
    <div className="bg-slate-900 flex flex-col rounded-lg my-2">
      <Toaster />

      <div className="bg-slate-800 px-4 rounded-t-lg">{title}:</div>
      <div className="flex flex-row justify-between items-center">
        <pre className="overflow-auto">
          <code>{snippet}</code>
        </pre>
        <button
          className="p-2 text-gray-300 hover:text-gray-100"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          <Copy />
        </button>
      </div>
    </div>
  );
}
