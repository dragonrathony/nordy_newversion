

function  returnResult(res,message,data) {
  res.status(200).json({
  message: message ,
  result:data
  });
}

module.exports = returnResult;
