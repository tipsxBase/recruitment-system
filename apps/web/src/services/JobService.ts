import {
  CreateJobDto,
  JobEntity,
  QueryJobListPaginationDto,
  RecruitmentPaginationResponse,
} from "@recruitment/schema";
import { postRequest } from "./xhr/clientFetch";

export const getJobs = (params: QueryJobListPaginationDto) => {
  const requestBody = {
    ...params,
    requestUrl: "/api/job/list",
  };

  return postRequest<
    QueryJobListPaginationDto,
    RecruitmentPaginationResponse<JobEntity>
  >("/api/job", requestBody);
};

export const createJob = (job: CreateJobDto) => {
  const requestBody = {
    requestUrl: "/api/job/create",
    job,
  };

  return postRequest("/api/job", requestBody);
};
