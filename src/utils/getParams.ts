export const params = (name: string) => ({
  filters: {
    class_id: {
      name: {
        $eq: name,
      },
    },
  },
});
