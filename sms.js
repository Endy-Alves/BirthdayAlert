require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

// Enviar uma mensagem SMS
client.messages
  .create({
    body: 'Olá do Twilio! 🚀',
    from: '+13204611767', // Seu número Twilio
    to: '+5515988158088' // Número de destino
  })
  .then(message => console.log(`Mensagem enviada com sucesso! SID: ${message.sid}`))
  .catch(error => console.error(`Erro ao enviar a mensagem: ${error.message}`));
  

/*   await client.messages
                .create({
                  body: `Hoje é aniversario de ${birthdayUser.username}!!!` ,
                  from: '+13204611767', // Seu número Twilio
                  to: `+55${user.phone}` // Número de destino
                })
              console.log(`Mensagem enviada com sucesso! SID: ${message.sid}`)
              */