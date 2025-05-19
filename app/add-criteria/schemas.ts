import { z } from "zod";

export type FormFieldType = "input" | "checkbox" | "textarea";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["input", "checkbox", "textarea"]),
});

export type FormValues = z.infer<typeof formSchema>;