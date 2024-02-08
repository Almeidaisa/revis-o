const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mysql = require('mysql2');
const session = require('express-session');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

app.use(session({
  secret: 'aluno',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/homeblog', (req, res) => {
  res.render('homeblog.ejs');
});

app.get('/postagens', (req, res) => {
  const sql = 'SELECT * FROM Postagens';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar postagens:', err);
      res.sendStatus(500);
    } else {
      res.render('postagens.ejs', { Postagens: results });
    }
  });


  });


app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/cadastro', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      res.redirect('/cadastro');
    } else {
      res.redirect('/');
    }
  });
});

app.post('/submit_post', (req, res) => {
  const { mensagens } = req.body;
  const sql = 'INSERT INTO Postagens (mensagens) VALUES (?)';
  db.query(sql, [mensagens], (err, result) => {
    if (err) {
      console.error('Erro ao inserir postagem:', err);
      res.redirect('/postagens');
    } else {
      res.redirect('/postagens');
    }
  });
});

app.get('/dash', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(__dirname + '/views/dash.html');
  } else {
    res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

// DELETE
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Postagens WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.redirect('/home');
    });
  });
  




