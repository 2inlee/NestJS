const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

// if문을 쓰지 않아도 express 에서는 라우트를 이렇게 처리해줌
app.get('/post', (req, res) => {
  res.send('<h1>Post Page</h1>');
});

app.get('/user', (req, res) => {
  res.send('<h1>User Page</h1>');
});

// 404 처리
app.use((req, res) => {
  res.status(404).send('<h1>404 Page Not Found</h1>');
});

app.listen(3000, () => {
  console.log('Express App on port 3000!');
});