"use client";
 
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from './ui/file-uploader'
import Image from "next/image";
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";
 
const FileUploadDropzone = () => {
  const [files, setFiles] = useState<File[] | null>([]);
 
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;
 
  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropzone}
    >
      <FileInput>
        <div className="flex flex-col items-center justify-center bg-muted border border-primary border-dashed h-32 w-full border bg-background rounded-md">
          <h1 className="text-gray-400">Add cover image</h1>
          <div className='font-extralight '>".jpg", ".jpeg", ".png", ".gif" are accepted</div>
        </div>
      </FileInput>
      <FileUploaderContent className="flex items-center flex-row gap-2">
        {files?.map((file, i) => (
          <FileUploaderItem
            key={i}
            index={i}
            className="size-20 p-0 rounded-md overflow-hidden"
            aria-roledescription={`file ${i + 1} containing ${file.name}`}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              height={80}
              width={80}
              className="size-20 p-0"
            />
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};
 
export default FileUploadDropzone;