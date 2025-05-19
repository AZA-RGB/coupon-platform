"use client";
import { FormFieldRenderer } from "./FormFeildRenderer";
import { FormField, formFields } from "./FormFeildTypes";
import { Separator } from "@/components/ui/separator";
import { AddCriterionDialog } from "./AddCriterionDialog";

interface CriteriaSectionProps {
  title: string;
  isGeneral?: boolean;
}

export function CriteriaSection({ title, isGeneral = false }: CriteriaSectionProps) {
  const criteriaList: FormField[] = [
  { name: "Username", type: "input", placeholder: "Enter username" },
  { name: "Add description", type: "textarea" },
  { name: "Agree to terms", type: "checkbox" },
];

  return (
    <>
      <div className="flex place-content-between">
        <div className="text-2xl text-primary">{title}</div>
        {!isGeneral && <AddCriterionDialog />}
      </div>
      <Separator className="-mt-3" />

      {criteriaList.map((formField) => (
        <FormFieldRenderer key={formField.name} field={formField}  name={formField.name} />
      ))}
      
    </>
  );
}