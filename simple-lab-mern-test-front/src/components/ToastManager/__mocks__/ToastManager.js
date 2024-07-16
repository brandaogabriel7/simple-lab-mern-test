const addToast = jest.fn();
const useToast = () => ({
  addToast,
});

export { useToast };
