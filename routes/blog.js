const {Router} = require("express")
const router= Router()
const multer=require('multer')
const path=require('path')
const Blog=require('../models/blog')
const Comment =require('../models/comments')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`
      cb(null,filename)
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render('addblog',{
        user:req.user,
    })
})

router.get('/:id',async(req,res)=>{

        const blog=await Blog.findById(req.params.id).populate('createdby')
        const comments = await Comment.find({ blogid: req.params.id }).populate('createdby');
        return res.render('blog',{
            user:req.user,
            blog,
            comments,
        })

})


router.post("/", upload.single("coverimage"), async (req, res) => {
    const {title,body}=req.body
    const blog = await Blog.create({
        body,
        title,
        createdby:req.user._id,
        coverimageurl:`/uploads/${req.file.filename}`
    })

    if (!req.file) {
        return res.status(400).send("File upload failed!");
    }

    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogid', async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogid:req.params.blogid,
        createdby:req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogid}`)

})


module.exports=router










