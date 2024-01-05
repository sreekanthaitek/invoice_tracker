const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
    secret: '13', 
    resave: false,
    saveUninitialized: true,
  }));
  const conn = process.env.MONGO_URL;
  mongoose.connect(conn);
  const userName = process.env.USER_NAME;
  const pass = process.env.PASSWORD;
  // Authentication middleware
  const authenticate = (req, res, next) => {
    const { username, password } = req.session;
    const isAuthenticated = username === userName && password === pass;
    if (isAuthenticated) {
      next();
    } else {
      res.status(401).send('Unauthorized. Please log in.');
    }
  };

//MONGO CONNECTION

const inputSchema = new mongoose.Schema({
    invoiceNumberf: String,
    pn: String,
    companyName: String,
    status: String,
    remarks: String,
})

const InputData = mongoose.model('InputData',inputSchema);

app.get('/atkFormUpload',(req,res)=>{
  res.sendFile(__dirname+'/public/atkFormUpload.html');
});

app.get('/indFormUpload',(req,res)=>{
  res.sendFile(__dirname+'/public/indFormUpload.html');
});

app.get('/rzUpload',(req,res)=>{
  res.sendFile(__dirname+'/public/rzUpload.html');
});

app.post('/indFormUpload',async(req,res)=>{
  let {invoiceNumberf,pn,companyName,status,remarks} = req.body;
  try{
    const inputData = new InputData({
        invoiceNumberf: invoiceNumberf,
        pn: pn,
        companyName: companyName,
        status: status,
        remarks: remarks,
    });
    await inputData.save();
    let a45 = fs.readFileSync('public/indForm.html')
    res.send(a45.toString());
  }
  catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/display', async (req, res) => {
  try {
    const data = await InputData.find();
    res.render('display', { data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { invoiceNumberf, pn, companyName, status, remarks } = req.body;
    await InputData.findByIdAndUpdate(id, { invoiceNumberf,pn,companyName,status,remarks });
    res.status(200).send('Data updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/atkFormUpload',async(req,res)=>{
    let {invoiceNumberf,pn,companyName,status,remarks} = req.body;
    try{
      const inputData = new InputData({
          invoiceNumberf: invoiceNumberf,
          pn: pn,
          companyName: companyName,
          status: status,
          remarks: remarks,
      });
      await inputData.save();
      let a = fs.readFileSync('public/atkForm.html')
      res.send(a.toString());
    }
    catch(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
})

app.post('/rzUpload',async(req,res)=>{
  let {invoiceNumberf,pn,companyName,status,remarks} = req.body;
  try{
    const inputData = new InputData({
        invoiceNumberf: invoiceNumberf,
        pn: pn,
        companyName: companyName,
        status: status,
        remarks: remarks,
    });
    await inputData.save();
    let a1 = fs.readFileSync('public/rzForm.html')
    res.send(a1.toString());
  }
  catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/kpmgUpload',(req,res)=>{
  res.sendFile(__dirname+'/public/kpmgUpload.html');
})

app.get('/form3upload',(req,res)=>{
  res.sendFile(__dirname+'/public/form3upload.html');
})

app.post('/form3upload',async(req,res)=>{
  let {invoiceNumberf,pn,companyName,status,remarks} = req.body;
  try{
    const inputData = new InputData({
        invoiceNumberf: invoiceNumberf,
        pn: pn,
        companyName: companyName,
        status: status,
        remarks: remarks,
    });
    await inputData.save();
    let a3 = fs.readFileSync('public/form3.html')
    res.send(a3.toString());
  }
  catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/kpmgUpload',async(req,res)=>{
  let {invoiceNumberf,pn,companyName,status,remarks} = req.body;
  try{
    const inputData = new InputData({
        invoiceNumberf: invoiceNumberf,
        pn: pn,
        companyName: companyName,
        status: status,
        remarks: remarks,
    });
    await inputData.save();
    let a2 = fs.readFileSync('public/kpmgform.html')
    res.send(a2.toString());
  }
  catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/home.html');
})

app.get('/offerForm.html',(req,res)=>{
  res.sendFile(__dirname+'/public/offerForm.html')
})

app.post('/login', (req, res) => {
    res.render('login');
});

app.get('/landing',authenticate, (req, res) => {
    res.sendFile(__dirname + '/public/landing.html');
});

app.post('/landing',(req, res) => {
    const { username, password } = req.body;
  
    if (username === userName && password === pass) {
      req.session.username = username;
      req.session.password = password;
      res.redirect('/landing');
    } else {
      let a5 = fs.readFileSync("/public/invalid.html");
      res.status(401).send(a5.toString())
    }
  });

app.get('/contact',(req,res)=>{
  res.sendFile(__dirname+'/public/contact.html')
})

app.listen(port,()=>{
    console.log(`server runnig at ${port}`)
})
