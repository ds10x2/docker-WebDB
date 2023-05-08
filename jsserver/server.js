const express = require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser')

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true})) 

// Mongoose 연결
mongoose.connect('mongodb://db:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const userSchema = new mongoose.Schema({
  name: String,
  id: String,
});

const User = mongoose.model('User', userSchema);

// HTML 파일 제공
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 사용자 정보를 DB에 추가
app.post('/addUser', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    id: req.body.id,
  });

  newUser.save()
  .then(() => {
    console.log(`Saved user information to the database: ${newUser}`);
    res.send('User information successfully saved to the database!');
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: failed to save user information to the database');
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});