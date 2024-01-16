const sendMessage = (res, statusCode, errorMsg, msgContent, data) => {
  res
    .status(statusCode)
    .json({ error: errorMsg, message: msgContent, data: data || {} });
};

module.exports = { sendMessage };
