const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const User = require('./modules/db');
const app = express();
require('dotenv').config();
const cron = require('node-cron');
const sendgridTransport = require('nodemailer-sendgrid-transport');


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));
function sendBirthdayEmails() {
  User.find({}, (err, users) => {
    if (err) console.log(err);
    else {
      users.forEach(birthdayUser => {
        if (new Date(birthdayUser.birthday).getDate() === new Date().getDate() &&
            new Date(birthdayUser.birthday).getMonth() === new Date().getMonth()) {
          // Enviar e-mail para todos os outros usuários
          users.forEach(user => {
            if (user.email !== birthdayUser.email) {
              let mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Aniversário de um usuário!',
                text: `Hoje é o aniversário de ${birthdayUser.name}!`
              };
              transporter.sendMail(mailOptions, (err, data) => {
                if (err){
                  console.log(err);
                } 
                else {
                  console.log('Email enviado!');
                }
              });
            }
          });
        }
      });
    }
  });
}


cron.schedule('41 12 * * *', sendBirthdayEmails);




app.post('/', async (req, res)=>{
  const {username, pass, email, birthday} = req.body
  if (!username || !pass || !email || !birthday) {
  return res.render('register')
  }

  const createUser = new User({username, pass, email,birthday})

  try{
    await createUser.save()
    res.redirect(`/landing`)
  } catch(err){
    res.send(err.message)
  }
})
app.get('/', (req,res) =>{
  res.render('register')
})

app.get('/landing/', async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await User.find().sort({ birthday: -1 });

    // Renderiza a página 'landing' e passa os usuários para ela
    res.render('landing', { users: users});
  } catch (err) {
    console.error(err);
    res.status(500).send('Ocorreu um erro ao buscar os usuários');
  }
})
//conexao com o banco de dados
mongoose.connect('mongodb+srv://endyalves:endyalves24@cluster0.rrc4lft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/userBirthays', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of the default 30s
});


  app.listen(5050, ()=>{
    console.log("Rodando na porta 5050")
  })