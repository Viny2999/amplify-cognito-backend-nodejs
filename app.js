const { Auth } = require('aws-amplify');
const express = require('express')
require('dotenv').config();

const app = express()
const port = 3000

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));

Auth.configure({
  userPoolId: process.env.USER_POOL_ID,
  userPoolWebClientId: process.env.WEB_CLIENT_ID,
  region: process.env.REGION,
  mandatorySignIn: false
});

let userGlobal;

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.signIn(email, password);
  userGlobal = user;
  res.send(user);
})

app.post('/code/:code', async (req, res) => {
  const code = req.params.code;

  const auth = await Auth.confirmSignIn(userGlobal, code);
  res.send(auth);
})

app.post('/signup', async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;
  
  const user = await Auth.signUp({
    username: email, 
    password: password,
    attributes: {
      email: email,
      name: name,
      phone_number: phoneNumber,
    }
  });
  
  res.send(user);
})

app.post('/signup/confirm', async (req, res) => {
  const { email, code } = req.body;
  
  await Auth.confirmSignUp(email, code);
  
  res.send();
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
