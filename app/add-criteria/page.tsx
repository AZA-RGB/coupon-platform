"use client";

import useSWR from "swr";
import { Spinner } from "@/components/ui/spinner";
import { AddCriterionDialog } from "./AddCriterionDialog";

import { FormFieldRenderer } from "./FormFeildRenderer";
import { FormFieldType } from "./schemas";
import { FormField } from "./FormFeildTypes";
import { Divide } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CriteriaPage() {
  const { isLoading, error, data, mutate } = useSWR("/criterias/index?page=1");
  return (
    <div className="px-10">
      <div className="text-4xl">Criteria preview</div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 md:px-10 mt-10">
        <div className="col-span-1 space-y-5">
          <div className="flex place-content-between">
            <div className="text-2xl text-primary">General criteria</div>
          </div>
          <Separator className="-mt-3" />
          {error && <div>failed to load criteria</div>}
          {isLoading && <Spinner />}
          {data &&
            data.data.data
              .filter(
                (criterion: { isGeneral: boolean }) =>
                  criterion.isGeneral === true
              )
              .map((criterion: FormField) => (
                <FormFieldRenderer field={criterion} />
              ))}
        </div>

        <div className="col-span-1 space-y-5">
          <div className="flex place-content-between">
            <div className="text-2xl text-primary">Additional criteria</div>
            <AddCriterionDialog refresh={()=>mutate()} />
          </div>
          <Separator className="-mt-3" />
          {isLoading && <Spinner />}
          {data &&
            data.data.data
              .filter(
                (criterion: { isGeneral: boolean }) =>
                  criterion.isGeneral === false
              )
              .map((criterion: FormField) => (
                <FormFieldRenderer field={criterion} />
              ))}
        </div>
      </div>
    </div>
  );
}
