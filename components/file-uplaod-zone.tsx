import { ImageUp } from "lucide-react";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "./ui/file-uploader";
import Image from "next/image";
import { useTranslations } from "next-intl";

const BASE_CDN = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com/";

interface ExistingFile {
  id: number;
  path: string;
  file_type: number;
  name: string;
  title: string | null;
}

const FileUploadDropzone = ({
  field,
  maxFiles,
  existingFiles,
}: {
  field: any;
  maxFiles?: number;
  existingFiles?: ExistingFile[];
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
    <div className="space-y-4">
      <FileUploader
        value={files}
        onValueChange={field.onChange}
        dropzoneOptions={dropzone}
      >
        <FileInput className="h-full">
          <div className="flex flex-col items-center justify-center border-primary border-dashed border-2 h-[200px] w-full border bg-background rounded-md">
            <ImageUp className="text-primary" />
            <h1 className="dark:text-gray-100">{t("addCoverImage")}</h1>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              .jpg, .jpeg, .png, .gif are accepted
            </div>
          </div>
        </FileInput>

        {/* New Files Preview */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">New Images</h3>
            <FileUploaderContent className="flex items-center flex-row gap-2 overflow-auto">
              {files.map((file: File, i: number) => (
                <FileUploaderItem
                  key={i}
                  index={i}
                  className="size-3/4 max-h-96 p-0 rounded-md"
                  aria-roledescription={`file ${i + 1} ${file.name}`}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-size-full object-cover p-0"
                  />
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          </div>
        )}
      </FileUploader>

      {/* Existing Files Preview */}
      {existingFiles && existingFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Current Image</h3>
          <div className="flex items-center flex-row gap-2 overflow-auto">
            {existingFiles.map((file, i) => (
              <div
                key={file.id}
                className="size-3/4 max-h-96 p-0 rounded-md relative"
              >
                <img
                  src={`${BASE_CDN}${file.path}`}
                  alt={file.name}
                  className="max-size-full object-cover p-0 rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;
