const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

module.exports = app;

let products = [
  { id: 1, name: 'iphone', price: 10 },
  { id: 2, name: 'macbook', price: 20 },
  { id: 3, name: 'apple vision', price: 30 }
];

let users = [
  { username: 'admin', password: 'root', group: 'admin' },
  { username: 'user1', password: 'password1', group: 'user' },
  { username: 'user2', password: 'password2', group: 'user' },
];

const jwt = require('jsonwebtoken');

const generateAuthToken = (username) => {
  const user = users.find(user => user.username === username.username);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  const token = jwt.sign({ username: user.username }, 'secreto');
  return token;
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  const userExists = users.some(u => u.username === req.body.username);

  if (!userExists) {
    res.status(401).json({ error: 'Username not found. Please register.' });
    console.log('Username not found. Please register.');
    return;
  }

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    console.log('Invalid credentials')
    return;
  }
  const group = users.find(u => u.username === username).group;
  const token = generateAuthToken({ username });
  res.status(200).json({ token, username: user.username, group: user.group });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (users.some(u => u.username === username)) {
    res.status(400).json({ error: 'Username is already in use.' });
    return;
  }

  users.push({ username, password, group: 'user' });
  res.status(201).json({ message: 'User registered successfully!' });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token not provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secreto');
    const user = users.find(user => user.username === decodedToken.username);
    const group = user ? user.group : null;
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ error: 'Permission denied. Only admin users can edit products.' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/products', authenticateToken, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'secreto');
  const user = users.find(user => user.username === decodedToken.username);
  const group = user ? user.group : null;

  const responseData = {
    products: products,
    group: group
  };
  res.status(200).json(responseData);
});

app.put('/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const productIndex = products.findIndex(product => product.id == id);

  if (productIndex !== -1) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secreto');
    const group = users.find(u => u.username === decodedToken.username).group;
    const isAdmin = decodedToken && group === 'admin';

    if (isAdmin) {
      products[productIndex] = { ...products[productIndex], name, price };
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(403).json({ error: 'Permission denied. Only admin users can edit products.' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
