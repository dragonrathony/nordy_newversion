/**
 * 
 * @param {response object} res 
 * @param {string} message 
 * @param {1: error, 0: success} error 
 * @param {response data} result 
 */

function returnResult(res, message, error, result) {
  res.json({
    message: message,
    error: error,
    result: result
  });
}

export default returnResult;
