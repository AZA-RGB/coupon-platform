import { z } from "zod";
import { formFieldTypes } from "./FormFeildTypes";
export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(formFieldTypes),
  isGeneral: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;
