const sendMessage = (res, statusCode, errorMsg, msgContent, data) => {
  if (statusCode === 500) {
    msgContent = "Internal Server Error.";
  }
  res
    .status(statusCode)
    .json({ error: errorMsg, message: msgContent, data: data || {} });
};

module.exports = { sendMessage };
