export default function handleError(err, req, res, next) {
  if (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Something went wrong, please try again.'
    });
  }
}
