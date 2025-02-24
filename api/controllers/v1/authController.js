const validation = require('../../validation/auth')
const authService = require('./../../services/v1/authService')
const message = require('../../common/message')

exports.signUp = async (req,res)=>{
  try {
    const { error } = validation.signup(req.body);
    // console.log("Errr==>",error)
    if (error) {
        return res.status(200).send({
          status: 400,
          message: error.details[0].message,
          data: {},
        });
      } else {
            let info = await authService.signup(req,res);
            console.log("Info==>",info)
            if(info.executed == 1){
              res.json({ status: 200, message: message.SUCESS , data : info.data });
            }
            else if(info.executed == 2){
              res.json({ status: 200, message: message.EMAILALREADYEXISTS , data : {} });
            }
            else{
              res.json({ status: 400, message:message.SOMETHINGWENTWRONG   , data : {}  });
            }
      }
  } catch (error) {
    console.log("errr=?",error)
    res.json({ status: 503, message: "SOMETHINGWENTWRONG"  , data : {}  });
  }
    
}
exports.login = async (req,res)=>{
  try {
    const { error } = validation.login(req.body);
    // console.log("Errr==>",error)
    if (error) {
        return res.status(200).send({
          status: 400,
          message: error.details[0].message,
          data: {},
        });
      } else {
            let info = await authService.login(req,res);
            console.log("Info==>",info)
            if(info.executed == 1){
              res.json({ status: 200, message: message.SUCESS , data : info.data });
            }
            else if(info.executed == 2){
              res.json({ status: 400, message: message.PASSWORDDOESNOTMATCH , data : {} });
            }
            else if(info.executed == 3){
              res.json({ status: 400, message: message.EMAILNOTFOUND , data : {} });
            }
            else{
              res.json({ status: 400, message:message.SOMETHINGWENTWRONG   , data : {}  });
            }
      }
  } catch (error) {
    console.log("errr=?",error)
    res.json({ status: 503, message: "SOMETHINGWENTWRONG"  , data : {}  });
  }
    
}
exports.getProfile = async (req,res)=>{
  try {
   
            let info = await authService.getProfile(req,res);
            console.log("Info==>",info)
            if(info.executed == 1){
              res.json({ status: 200, message: message.SUCESS , data : info.data });
            }
            else{
              res.json({ status: 400, message:message.USERNOTFOUND   , data : {}  });
            }
      
  } catch (error) {
    console.log("errr=?",error)
    res.json({ status: 503, message: "SOMETHINGWENTWRONG"  , data : {}  });
  }
    
}