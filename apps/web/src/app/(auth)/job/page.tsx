import JobEditor, { JobEditorMode } from "@/components/job/JobEditor";

const Job = async () => {
  return (
    <div className="h-full">
      <JobEditor mode={JobEditorMode.Create} />
    </div>
  );
};

export default Job;
