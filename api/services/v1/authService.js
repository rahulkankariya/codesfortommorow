
const commonHelper = require('../../common/commonHelper')
const database = require('../../common/database')
const storeProcudures = require('../../common/storeProdure')
const { login } = require('../../validation/auth')
module.exports = {
    
    signup:async (req,res)=>{
        return new Promise((resolve,reject) => {
            try {
                let encryptPassword = commonHelper.encryptPassword(req.body.password);
                console.log("enc==?",encryptPassword)
                database.executeQuery(
                    storeProcudures.signup,[
                        req.body.firstName,
                        req.body.lastName,
                        req.body.email,
                        encryptPassword
                    ],
                    res, function(err,rows){
                     
        
                        if(rows[0][0].res == 1){
                            let payload ={
                                id:rows[1][0].id,
                                uniqueId:rows[1][0].uniqueId
                            }
                            let token = commonHelper.generateJwTToken(payload)
                            let userDetails = {
                                userDetails:rows[1][0],
                                token
                            }
                            resolve({ executed: 1, data: userDetails });
                        }else{
                            resolve({ executed: 2, data: {} });
                        }
                })
            } catch (error) {
                console.log("err==",error)
                reject({ executed: 0, data: {} });
            }
        })
    },
    login:(req,res)=>{
        return new Promise((resolve,reject) => {
            try {
               
                
                database.executeQuery(
                    storeProcudures.login,[
                        req.body.email,
                    ],
                    res, function(err,rows){
                        console.log("err==>",err)
                        console.log("Rwos==?",rows)
                        if(rows[0][0].res == 1){ // email  found 
                        let encryptPassword = commonHelper.decryptPassword(rows[1][0].password);
                        if(encryptPassword == req.body.password){
                            database.executeQuery(
                                storeProcudures.uuidUpdate,[
                                  rows[1][0].id
                                ],
                                res, function(err,rows1){
                                    if(rows1[0][0].res == 1){
                                        let payload ={
                                            id:rows1[1][0].id,
                                            uniqueId:rows1[1][0].uniqueId
                                        }
                                        let token = commonHelper.generateJwTToken(payload)
                                        let userDetails = {
                                            userDetails:rows1[1][0],
                                            token
                                        }
                                        resolve({ executed: 1, data: userDetails });
                                    }else{

                                    }
                                 
                                })
                        
                        }else{
                            resolve({ executed: 2, data: {} });
                        }

                       }else{
                        console.log("user  not found")
                        resolve({ executed: 3, data: {} });
                       }
                })
            } catch (error) {
                console.log("err==",error)
                reject({ executed: 0, data: {} });
            }
        })
    },
    getProfile:(req,res)=>{
        return new Promise((resolve,reject) => {
            try {
               console.log("req.decoded==>",req.decoded)
                
                database.executeQuery(
                    storeProcudures.getProfile,[
                        req.decoded.id,
                    ],
                    res, function(err,rows){
                        console.log("err,rows",err,rows)
                       if(rows[0][0].res == 1){
                        resolve({ executed: 1, data: rows[1][0] });
                       }else{
                        resolve({ executed: 0, data: {} });
                       }
                })
            } catch (error) {
                console.log("err==",error)
                reject({ executed: 0, data: {} });
            }
        })
    },
    userTokenSaved:(id,token)=>{

    }
}