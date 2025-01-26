import {
  JobEntity,
  QueryJobListPaginationDto,
  RecruitmentPaginationResponse,
} from "@recruitment/schema";
import { getRequest } from "../clientFetch";

export const getJobs = (params: QueryJobListPaginationDto) => {
  return getRequest<
    QueryJobListPaginationDto,
    RecruitmentPaginationResponse<JobEntity>
  >("/api/job", params);
};
