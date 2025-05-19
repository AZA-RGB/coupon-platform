"use client";

import { CriteriaSection } from "./CriteriaSection";

export default function CriteriaPage() {
  return (
    <div className="px-10">
      <div className="text-4xl">Criteria preview</div>
      <div className="grid grid-cols-2 gap-10 px-10 mt-10">
        <div className="col-span-1 space-y-5">
          <CriteriaSection title="General criteria" isGeneral />
        </div>
        <div className="col-span-1 space-y-5">
          <CriteriaSection title="Additional criteria" />
        </div>
      </div>
    </div>
  );
}