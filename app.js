const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = (process.env.DB_CONNECTION)
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to DB')
});

// routes
// Apply this to every single routes using (*)
app.get('*', checkUser);
app.get('/',(req,res)=>res.render('home',{title:'Home'}));
app.get('/smoothies', requireAuth, (req,res)=>res.render('smoothies',{title:'Smoothies'}));
app.use(authRoutes);

// // Cookies
// // set cookies
// app.get('/set-cookies',(req,res)=>{
//   // res.setHeader('Set-Cookie', 'newUser=true');
  
//   res.cookie('newUser', false);
//   // res.cookie('isEmployed', true, {maxAge:1000*60*60*24, secure:true});
//   res.cookie('isEmployee', true, {maxAge:1000*60*60*24, httpOnly:true});
//   res.send('You got the cookie!')
// });
// // get or Read cookies
// app.get('/read-cookies',(req,res)=>{
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });

app.listen(2022);