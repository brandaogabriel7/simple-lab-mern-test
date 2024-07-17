const badRequestErrorHandler = (err, req, res, next) => {
  if (/is required/i.test(err.message) || /invalid/i.test(err.message)) {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
};

export default badRequestErrorHandler;
