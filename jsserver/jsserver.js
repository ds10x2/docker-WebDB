const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true
});

// MySQL 쿼리 실행 함수
function queryDatabase(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, values, (err, results) => {
        connection.release();

        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });
}

// HTML 파일 제공
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 사용자 정보를 DB에 추가
app.post('/addUser', (req, res) => {
  const name = req.body.name;
  const userid = req.body.userid;
  const sql = 'INSERT INTO users (name, userid) VALUES (?, ?)';
  const values = [name, userid];

  queryDatabase(sql, values)
    .then(() => {
      console.log(`Saved user information to the database: ${name}, ${userid}`);
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
