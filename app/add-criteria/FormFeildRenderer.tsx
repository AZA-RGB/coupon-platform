"use client";
import { FormField as FormFieldType } from "./FormFeildTypes";
import { componentMap } from "./FormFeildTypes";
import { 
  FormControl, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormField as ShadcnFormField,
  useFormContext
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface FormFieldRendererProps {
  field: FormFieldType;
}

export function FormFieldRenderer({ 
field
}: FormFieldRendererProps) {
  // const form = useFormContext();
    const Component = componentMap[field.type];
  // if (!form) {
    return <>
          {field.type !== "checkbox" && <label>{field.name}</label>}
            {field.type === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <Component
                  id={field.name}
                />
                <label htmlFor={field.name}>{field.name}</label>
              </div>
            ) : (
              <Component/>
            )}

        </>
  



  // return (
  //   <ShadcnFormField
  //     control={form.control}
  //     name={name}
  //     render={({ field: formField }) => (
        
  //       <FormItem>
  //         {field.type !== "checkbox" && <FormLabel>{field.name}</FormLabel>}
  //         <FormControl>
  //           {field.type === "checkbox" ? (
  //             <div className="flex items-center space-x-2">
  //               <Component
  //                 checked={formField.value}
  //                 onCheckedChange={formField.onChange}
  //                 id={name}
  //               />
  //               <FormLabel htmlFor={name}>{field.name}</FormLabel>
  //             </div>
  //           ) : (
  //             <Component
  //               {...formField}
  //               placeholder={field.placeholder}
  //             />
  //           )}
  //         </FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     )}
  //   />
  // );
}