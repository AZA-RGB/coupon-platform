import dynamic from "next/dynamic";

export const formFieldTypes = ["input", "checkbox", "textarea"] as const;

// 2. Derive the type from the array
export type FormFieldType = typeof formFieldTypes[number]; // "input" | "checkbox" | ...




export interface FormField {
  name: string;
  type: FormFieldType;
  placeholder?: string;
}

export const formFields: FormField[] = [
  { name: "Username", type: "input", placeholder: "Enter username" },
  { name: "Add description", type: "textarea" },
  { name: "Agree to terms", type: "checkbox" },
];

// Dynamic imports with loading states
const DynamicInput = dynamic(
  () => import("@/components/ui/input").then((mod) => mod.Input),
  { 
    loading: () => <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />,
    ssr: false 
  }
);

const DynamicCheckbox = dynamic(
  () => import("@/components/ui/checkbox").then((mod) => mod.Checkbox),
  { 
    loading: () => <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800  rounded-md animate-pulse" />,
    ssr: false 
  }
);

const DynamicTextarea = dynamic(
  () => import("@/components/ui/textarea").then((mod) => mod.Textarea),
  { 
    loading: () => <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />,
    ssr: false 
  }
);

export const componentMap = {
  input: DynamicInput,
  checkbox: DynamicCheckbox,
  textarea: DynamicTextarea,
};