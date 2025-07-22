import dynamic from "next/dynamic";

export const formFieldTypes = [
  "input",
  "checkbox",
  "textarea",
  "number",
  "file",
] as const;

export type FormFieldType = (typeof formFieldTypes)[number];

export interface FormField {
  name: string;
  type: FormFieldType;
  isGeneral: boolean;
  id: string;
}

const DynamicInput = dynamic(
  () => import("@/components/ui/input").then((mod) => mod.Input),
  {
    loading: () => (
      <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
    ),
    ssr: false,
  },
);

const DynamicCheckbox = dynamic(
  () => import("@/components/ui/checkbox").then((mod) => mod.Checkbox),
  {
    loading: () => (
      <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
    ),
    ssr: false,
  },
);

const DynamicTextarea = dynamic(
  () => import("@/components/ui/textarea").then((mod) => mod.Textarea),
  {
    loading: () => (
      <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
    ),
    ssr: false,
  },
);

const DynamicNumberInput = dynamic(
  () => import("@/components/ui/NumberInput").then((mod) => mod.Input),
  {
    loading: () => (
      <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
    ),
    ssr: false,
  },
);

const DynamicFileInput = dynamic(
  () => import("@/components/ui/FileInput").then((mod) => mod.Input),
  {
    loading: () => (
      <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
    ),
    ssr: false,
  },
);

export const componentMap = {
  input: DynamicInput,
  checkbox: DynamicCheckbox,
  textarea: DynamicTextarea,
  number: DynamicNumberInput,
  file: DynamicFileInput,
};
