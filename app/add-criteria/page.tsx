"use client";

import useSWR from "swr";
import { Spinner } from "@/components/ui/spinner";
import { AddCriterionDialog } from "./AddCriterionDialog";

import { FormFieldRenderer } from "./FormFeildRenderer";
import { FormFieldType } from "./schemas";
import { FormField } from "./FormFeildTypes";
import { Divide } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DeleteCriterionDialog } from "./DeleteCriterionDialob";
import { UpdateCriterionDialog } from "./UpdateCriterionDialog";
import { useTranslations } from "next-intl";

export default function CriteriaPage() {
  const { isLoading, error, data, mutate } = useSWR("/criterias/index?page=1");
  const t = useTranslations("CriteriaPage");
  return (
    <div className="px-10 mt-2">
      <div className="flex place-content-between ">
        <div className="text-4xl">{t("title")}</div>
        <AddCriterionDialog refresh={() => mutate()} />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 md:px-10 mt-10">
        <div className="col-span-1 space-y-5">
          <div className="text-2xl text-primary">{t("generalCriteria")}</div>

          <Separator className="-mt-3 " />
          <div className="mt-7"></div>
          {error && <div>{t("failedToLoadCriteria")}</div>}
          {isLoading && <Spinner />}
          {data &&
            data.data.data
              .filter(
                (criterion: { isGeneral: boolean }) =>
                  criterion.isGeneral === true,
              )
              .map((criterion: FormField) => (
                <div
                  key={criterion.id}
                  className="flex place-content-between items-center "
                >
                  <div className="flex-1">
                    <FormFieldRenderer field={criterion} />
                  </div>
                  <div className="mt-4 mx-4">
                    <UpdateCriterionDialog
                      refresh={() => mutate()}
                      criterion={criterion}
                    />
                  </div>
                  <div className="mt-4 mx-4">
                    <DeleteCriterionDialog
                      refresh={() => mutate()}
                      criterion={criterion}
                    />
                  </div>
                </div>
              ))}
        </div>

        <div className="col-span-1 space-y-5">
          <div className="text-2xl text-primary">{t("additionalCriteria")}</div>
          <Separator className="-mt-3 mb-7" />
          {isLoading && <Spinner />}
          {data &&
            data.data.data
              .filter(
                (criterion: { isGeneral: boolean }) =>
                  criterion.isGeneral === false,
              )
              .map((criterion: FormField) => (
                <div
                  key={criterion.id}
                  className="flex place-content-between items-center "
                >
                  <div className="flex-1">
                    <FormFieldRenderer field={criterion} />
                  </div>
                  <div className="mt-4 mx-4">
                    <UpdateCriterionDialog
                      key={criterion.id}
                      refresh={() => mutate()}
                      criterion={criterion}
                    />
                  </div>
                  <div className="mt-4 mx-4">
                    <DeleteCriterionDialog
                      key={criterion.id}
                      refresh={() => mutate()}
                      criterion={criterion}
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
