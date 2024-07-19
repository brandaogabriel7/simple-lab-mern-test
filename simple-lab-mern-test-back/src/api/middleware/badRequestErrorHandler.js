const badRequestErrorHandler = (err, req, res, next) => {
  const badRequestMessageRgx =
    /(is required)|(invalid)|(can't be in the future)/i;
  if (badRequestMessageRgx.test(err.message)) {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
};

export default badRequestErrorHandler;
