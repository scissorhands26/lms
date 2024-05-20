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
    <div className="my-2 flex flex-col rounded-lg bg-blue-300 dark:bg-slate-900">
      <Toaster />

      <div className="rounded-t-lg bg-blue-200 px-4 dark:bg-slate-800">
        {title}:
      </div>
      <div className="flex flex-row items-center justify-between">
        <pre className="overflow-auto">
          <code className="font-mono">{snippet}</code>
        </pre>
        <button
          className="p-2 text-white hover:text-black dark:text-gray-300 dark:hover:text-gray-100"
          onClick={copyToClipboard}
          aria-label="Copy to clipboard"
        >
          <Copy />
        </button>
      </div>
    </div>
  );
}
