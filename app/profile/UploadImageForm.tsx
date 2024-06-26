"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

export default function UploadImageForm({ user }: any) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/users/records/${user.id}`,
          {
            method: "PATCH",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const createdRecord = await response.json();
        console.log("File uploaded successfully:", createdRecord);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="flex w-full max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-12 transition-colors hover:border-primary"
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded profile picture"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Drag and drop your profile picture here, or
            </p>
            <label
              htmlFor="file-upload"
              className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Select a file
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
}
