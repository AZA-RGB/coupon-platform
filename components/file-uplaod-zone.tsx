import { ImageUp } from "lucide-react";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "./ui/file-uploader";
import Image from "next/image";
import { useTranslations } from "next-intl";

const FileUploadDropzone = ({
  field,
  maxFiles,
}: {
  field: any;
  maxFiles?: number;
}) => {
  const files = field.value || [];
  const t = useTranslations();
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: maxFiles || 4,
    maxSize: 1 * 1024 * 1024,
  };

  return (
    <FileUploader
      value={files}
      onValueChange={field.onChange}
      dropzoneOptions={dropzone}
    >
      <FileInput className="h-full">
        <div className="flex flex-col items-center justify-center  border-primary border-dashed border-2 h-[200px] w-full border bg-background rounded-md">
          <ImageUp className="text-primary" />
          <h1 className="dark:text-gray-100">{t("addCoverImage")}</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            .jpg, .jpeg, .png, .gif are accepted
          </div>
        </div>
      </FileInput>
      <FileUploaderContent className="flex items-center flex-row gap-2 overflow-auto">
        {files.map((file: File, i: number) => (
          <FileUploaderItem
            key={i}
            index={i}
            className="size-3/4  max-h-96 p-0 rounded-md "
            aria-roledescription={`file ${i + 1}  ${file.name}`}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="max-size-full object-cover  p-0"
            />
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default FileUploadDropzone;
