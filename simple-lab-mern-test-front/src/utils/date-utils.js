const toISODateOnlyString = (date) => {
  return date.toISOString().split("T")[0];
};
export { toISODateOnlyString };
