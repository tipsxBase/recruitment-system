import { getSession } from "@/app/actions/session";

const Job = async () => {
  await getSession();

  return <div>Job</div>;
};

export default Job;
