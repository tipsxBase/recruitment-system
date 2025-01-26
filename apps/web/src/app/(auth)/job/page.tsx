import JobEditor, { JobEditorMode } from "@/components/job/JobEditor";
import JobTable from "@/components/job/JobTable";

const Job = async () => {
  return (
    <div className="h-full">
      <JobEditor mode={JobEditorMode.Create} />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <JobTable />
      </div>
    </div>
  );
};

export default Job;
