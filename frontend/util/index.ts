export const getError = (error: Error) => {
  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  };
};
