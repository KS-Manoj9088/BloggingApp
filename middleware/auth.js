const { validatetoken } = require("../services/authentication")


function checkforauth(cookiename){
    return (req,res,next)=>{
        const tokencookivalue=req.cookies[cookiename]
        if(!tokencookivalue){
            return next()
        }
        try{
            const userpayload=validatetoken(tokencookivalue)
            req.user=userpayload
        }catch(error){}
        next()



    }
}




module.exports={checkforauth}










