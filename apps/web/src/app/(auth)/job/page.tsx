import JobActions from "@/components/job/JobActions";
import JobEditor from "@/components/job/JobEditor";
import JobTable from "@/components/job/JobTable";
import { JobStoreProvider } from "@/providers/job-store-provider";

const Job = () => {
  return (
    <JobStoreProvider>
      <div className="h-full">
        <JobActions />
        <JobEditor />
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <JobTable />
        </div>
      </div>
    </JobStoreProvider>
  );
};

export default Job;
