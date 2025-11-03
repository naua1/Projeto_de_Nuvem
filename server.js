import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;
const MONGO = process.env.MONGO
const uploadsDir = path.join(process.cwd(),'uploads');
if(!fs.existsSync(uploadsDir))fs.mkdirSync(uploadsDir);
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(uploadsDir));
app.use(express.static(path.join(process.cwd(),'public')));

mongoose.connect(MONGO).then(()=>console.log('Mongo conectado'));

const Post = mongoose.model('Post', new mongoose.Schema({
 title:String,text:String,imageUrl:String,createdAt:{type:Date,default:Date.now}
}));

const storage = multer.diskStorage({
 destination:(req,file,cb)=>cb(null,uploadsDir),
 filename:(req,file,cb)=>cb(null,Date.now()+path.extname(file.originalname))
});
const upload = multer({storage});

app.post('/api/posts',upload.single('image'),async(req,res)=>{
 try{
  const {title='',text=''}=req.body;
  const imageUrl=req.file?'/uploads/'+req.file.filename:null;
  const post=new Post({title,text,imageUrl});
  await post.save();
  res.json(post);
 }catch(e){res.status(500).json({error:'Erro'});}
});
app.get('/api/posts',async(req,res)=>{const posts=await Post.find().sort({createdAt:-1});res.json(posts);});
app.listen(PORT,()=>console.log('Server on http://localhost:'+PORT));
