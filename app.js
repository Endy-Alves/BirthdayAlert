const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./modules/db');
const app = express();
require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


async function sendBirthdaySMS() {
  console.log('entrou na funcao');
  try {
    const users = await User.find()
    console.log(users);

    for (const birthdayUser of users) {
      console.log(`Verificando usuário: ${birthdayUser.username}`);
      const birthday = new Date(birthdayUser.birthday);
      const today = new Date();
      console.log(today, birthday);
      console.log('Birthday Month:', birthday.getMonth(), 'Today Month:', today.getMonth());
      console.log('Birthday Date:', birthday.getDate(), 'Today Date:', today.getDate());

      if (birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()) {
        console.log(`É o aniversário de ${birthdayUser.username}!`);

        for (const user of users) {
          console.log("entrou no IF")
          if (user.email !== birthdayUser.email) {
            try {

              // Defina os dados que deseja enviar na requisição POST
              const params = {
                destinatario: "endyalves095@gmail.com",
                assunto: `Aniversario de ${birthdayUser.username}`,
                mensagem: "mensagem"
              };
              console.log(params)
              // Defina a URL da API para a qual você está enviando a requisição POST
             var url = `https://pm.rancharia.sp.gov.br/prefeitura/api_email/?destinatario=${params.destinatario}&assunto=${params.assunto}&mensagem=${params.mensagem}`;
             url = encodeURI(url);
             console.log(url);
              // Faça a requisição POST usando o Axios
              axios.post(url)
                .then(response => {
                  console.log('Resposta da API:', response.data);
                })
                .catch(error => {
                  console.error('Erro ao fazer requisição:', error);
                });
            } catch (error) {
              console.error(`Erro ao enviar a mensagem: ${error.message}`);
            }
          }
        }
      }
    }
 } catch (err) {
   console.log(err);
  }
}
sendBirthdaySMS();
cron.schedule('26 14 * * *', () => {
  console.log('funcao agendada');

});


app.post('/', async (req, res) => {
  const { username, email, birthday } = req.body
  if (!username || !email || !birthday) {
    return res.render('register')
  }

  const createUser = new User({ username, email, birthday })

  try {
    await createUser.save()
    res.redirect(`/landing`)
  } catch (err) {
    res.send(err.message)
  }
})
app.get('/', (req, res) => {
  res.render('register')
})

app.get('/landing/', async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await User.find().sort({ birthday: -1 });

    // Renderiza a página 'landing' e passa os usuários para ela
    res.render('landing', { users: users });
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


app.listen(5050, () => {
  console.log("Rodando na porta 5050")
})