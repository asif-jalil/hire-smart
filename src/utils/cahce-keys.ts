export const buildCacheKey = (...id: number[]) => {
  return {
    JOB_WITH_ID: `/v1/jobs/${id[0]}`,
    METRIC: '/v1/metric',
    JOB_APPLICATIONS: `V1/jobs/${id[0]}/applications`,
  };
};
