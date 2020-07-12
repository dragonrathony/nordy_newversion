/*
  * Created By : khalid Hashmi
  * Created Date : 12-03-2020
  * Purpose : Declare user mutation SignUp,
*/

var { apidetails } = require("../../constants"),

  returnResult = require('../../result');
 

  generate = require('nanoid/generate');
  const jwt = require('jsonwebtoken')
  const jwtExpirySeconds = 300;
var getToken = async (req, res, next) => {  

        let apikey=apidetails.key;
        let jwtKey=apidetails.secret;
        const token = jwt.sign({ apikey }, jwtKey, {
          algorithm: 'HS256',
          expiresIn: jwtExpirySeconds
        })
        console.log('token:', token)
        
        returnResult(res, 'user created successfully.', {}); return false;
      
};



module.exports = { getToken };
