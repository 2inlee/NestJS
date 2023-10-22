// import http from 'http'; // ES2015
const http = require('http');
const url = require('url');

// localhost -> 127.0.0.1 -> loop back -> 서버를 실행한 컴퓨터
const host = 'localhost';
const port = 3000;

// req = > 요청
// res => 응답

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;


  if (path === '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Home Page</h1>');
  }else if(path === '/post'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Post Page</h1>');
  }else if(path === '/user'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>User Page</h1>');
  }else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>404 Page Not Found</h1>');
  }
});

// 서버가 실행됐을 때 실행되는함수 () => {}
server.listen(port, host, () => {
  console.log(`Http Server running on ${host}:${port}`);
});