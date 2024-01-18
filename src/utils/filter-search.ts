export const filterOption = (
  input: string,
  option?: { label: string; value: number | string }
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
