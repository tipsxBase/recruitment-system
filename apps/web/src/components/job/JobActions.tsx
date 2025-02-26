"use client";
import { useJobStore } from "@/providers/job-store-provider";
import { Button } from "../ui/button";
import { JobEditorMode } from "@/stores/job-store";
import { UserPlus } from "lucide-react";

export default function JobActions() {
  const updateMode = useJobStore((store) => store.updateMode);

  const addJob = () => {
    updateMode(JobEditorMode.Create);
  };

  return (
    <div className="mb-2">
      <Button onClick={addJob}>
        添加岗位 <UserPlus />
      </Button>
    </div>
  );
}
