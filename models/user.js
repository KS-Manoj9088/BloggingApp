const {createHmac,randomBytes}=require('crypto')
const {Schema,model}=require('mongoose')
const {createtoken,validatetoken}=require('../services/authentication')

const userschema = new Schema({

    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,

    },
    password:{
        type:String,
        required:true,

    },

    profileimageurl:{
        type:String,
        default:'./images/avatar.png',
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    },

},{timestamps:true})

userschema.pre('save', function(next){
    const user=this;
    if(!user.isModified("password")) return next();

    const salt='somerandomsalt'
    const hashpassword=createHmac("sha256",salt)
            .update(user.password)
            .digest("hex")

    this.salt=salt
    this.password=hashpassword
    next()

})


userschema.static('matchpasswordandgeneratetoken', async function (email,password){
    const user= await this.findOne({email})
    if (!user) throw new Error ('User not Found')

    const salt=user.salt
    const hashpassword=user.password

    const userprovided=createHmac("sha256",salt)
    .update(password)
    .digest("hex")

    if (userprovided!==hashpassword) throw new Error("incorrect password")

    const token=createtoken(user)
    return token

})


const User=model('user',userschema)
module.exports=User