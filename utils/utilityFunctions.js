const sendMessage = (res, statusCode, errorMsg, msgContent) => {
  res.status(statusCode).json({ error: errorMsg, message: msgContent });
};

module.exports = { sendMessage };
