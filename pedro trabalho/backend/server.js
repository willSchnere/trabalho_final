// server.js
const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
const port = 4000;

app.use(cors({
  origin: '*',
}));

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
};

// Rota para registro de usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  });
});

// Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user);
    res.json({ token });
  });
});

// Middleware para verificar o JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

// Rota para cadastrar um navio
app.post('/ships', authMiddleware, (req, res) => {
  const { nome_navio, tipo, imo_number, size, cargo_capacity } = req.body;
  const ownerId = req.user.userId;
  db.query(
    'INSERT INTO ships (nome_navio, imo_number, tipo, size, cargo_capacity, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
    [nome_navio, imo_number, tipo, size, cargo_capacity, ownerId],
    (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar navio:', err);
        return res.status(500).json({ message: 'Erro ao cadastrar navio' });
      }
      res.status(201).json({ message: 'Navio cadastrado com sucesso' });
    }
  );
});

// Rota para visualizar os navios do usuário logado ou todos os navios se for admin
app.get('/ships', authMiddleware, (req, res) => {
  const { role, userId } = req.user;

  if (role === 'admin') {
    db.query('SELECT * FROM ships', (err, results) => {
      if (err) {
        console.error('Erro ao obter navios:', err);
        return res.status(500).json({ message: 'Erro ao obter navios' });
      }
      res.json(results);
    });
  } else {
    db.query('SELECT * FROM ships WHERE owner_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Erro ao obter navios do usuário:', err);
        return res.status(500).json({ message: 'Erro ao obter navios do usuário' });
      }
      res.json(results);
    });
  }
});

app.get('/ships', authMiddleware, (req, res) => {
  const { role, userId } = req.user;

  if (role === 'admin') {
    db.query('SELECT * FROM ships', (err, results) => {
      if (err) {
        console.error('Erro ao obter navios:', err);
        return res.status(500).json({ message: 'Erro ao obter navios' });
      }
      if (results.length === 0) {
        return res.json({ message: 'Nenhum navio encontrado' });
      }
      res.json(results);
    });
  } else {
    db.query('SELECT * FROM ships WHERE owner_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Erro ao obter navios do usuário:', err);
        return res.status(500).json({ message: 'Erro ao obter navios do usuário' });
      }
      if (results.length === 0) {
        return res.json({ message: 'Você não possui navios cadastrados' });
      }
      res.json(results);
    });
  }
});

// Rota para atualizar um navio
app.put('/ships/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nome_navio, tipo, imo_number, size, cargo_capacity } = req.body;

  // Verifica se o navio pertence ao usuário logado ou se é admin
  db.query('SELECT * FROM ships WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao verificar navio:', err);
      return res.status(500).json({ message: 'Erro ao verificar navio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Navio não encontrado' });
    }

    const ship = results[0];

    if (ship.owner_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Você não tem permissão para editar este navio' });
    }

    // Atualiza os dados do navio
    const sql = `
      UPDATE ships
      SET nome_navio = ?, tipo = ?, imo_number = ?, size = ?, cargo_capacity = ?
      WHERE id = ?
    `;
    const values = [nome_navio, tipo, imo_number, size, cargo_capacity, id];

    db.query(sql, values, (err) => {
      if (err) {
        console.error('Erro ao atualizar navio:', err);
        return res.status(500).json({ message: 'Erro ao atualizar navio' });
      }
      res.status(200).json({ message: 'Navio atualizado com sucesso' });
    });
  });
});

// Rota para remover um navio
app.delete('/ships/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  // Verifica se o usuário é o proprietário do navio ou admin
  db.query('SELECT * FROM ships WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao verificar navio:', err);
      return res.status(500).json({ message: 'Erro ao verificar navio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Navio não encontrado' });
    }

    const ship = results[0];

    if (ship.owner_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este navio' });
    }

    // Deleta o navio
    db.query('DELETE FROM ships WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Erro ao deletar navio:', err);
        return res.status(500).json({ message: 'Erro ao deletar navio' });
      }
      res.json({ message: 'Navio removido com sucesso' });
    });
  });
});

// Rota para registrar uma viagem
app.post('/travel', authMiddleware, (req, res) => {
  const {
    cargoQuantity,
    cargoType,
    arrivalDate,
    equipment,
    cargoDocument,
    stayTime,
    representativePhone,
  } = req.body;

  const ownerId = req.user.userId;

  db.query(
    `INSERT INTO travel (cargo_quantity, cargo_type, arrival_date, equipment, cargo_document, stay_time, representative_phone, owner_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cargoQuantity,
      cargoType,
      arrivalDate,
      equipment,
      cargoDocument,
      stayTime,
      representativePhone,
      ownerId,
    ],
    (err, result) => {
      if (err) {
        console.error('Erro ao registrar viagem:', err);
        return res.status(500).json({ message: 'Erro ao registrar viagem' });
      }
      res.status(201).json({ message: 'Viagem registrada com sucesso', id: result.insertId });
    }
  );
});
// Rota para visualizar viagens de um navio
app.get('/ships/:id/viagens', authMiddleware, (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT cargo_quantity, cargo_type, arrival_date, equipment, cargo_document, stay_time, representative_phone FROM travel WHERE owner_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Erro ao obter viagens:', err);
        return res.status(500).json({ message: 'Erro ao obter viagens' });
      }
      res.json(results);
    }
  );
});
// Iniciando o servidor
app.listen(port, () => {
  console.log(`API do porto ouvindo na porta ${port}`);
});
