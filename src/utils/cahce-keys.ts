export const buildCacheKey = (id?: number) => {
  return {
    JOB_WITH_ID: `/v1/jobs/${id}`,
    METRIC: '/v1/metric',
  };
};
