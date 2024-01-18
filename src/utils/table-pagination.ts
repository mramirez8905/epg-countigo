

export const convertParams = (params: any) => ({
  ...params,
  pagination: {
    page: params.pagination?.current,
    pageSize: params.pagination?.pageSize,
    ...params.pagination,
  },
  filters: params.filters,
});
