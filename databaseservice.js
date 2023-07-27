// index.js
const pool = require('./databaseconnection');

// Define the SQL query for creating the 'users' table
function createUserTable(){
  const connection = pool.connect();
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    )
  `;

  // Create the 'users' table
  const table = connection.query(createUserTableQuery, (err, res) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created successfully');
    }
  });
  return table;
}


// index.js

// Register a new user
function insertUser(){
  const connection = pool.connect();
  const insertUserQuery = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
  const employee = connection.query(insertUserQuery, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Error registering user' });
    } else {
      const newUser = result.rows[0];
      res.json({ id: newUser.id, username: newUser.username });
    }
  });
  return employee;
}

function getBalance(){
  const connection = pool.connect();
  
   // Fetch balance from the 'wallets' table based on the user_id
   const getBalanceQuery = `
   SELECT balance FROM wallets WHERE user_id = $1
 `;

 pool.query(getBalanceQuery, [userId], (err, result) => {
   if (err) {
     console.error('Error fetching wallet balance:', err);
     res.status(500).json({ error: 'Error fetching wallet balance' });
   } else {
     const balance = result.rows[0]?.balance || 0;
     res.json({ balance });
   }
 });
}
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert the new user into the 'users' table
   
  
   
  });
  
  // Login and issue a JWT token
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Fetch the user from the 'users' table based on the username
    const getUserQuery = `
      SELECT * FROM users WHERE username = $1
    `;
  
    pool.query(getUserQuery, [username], async (err, result) => {
      if (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Error fetching user' });
      } else {
        const user = result.rows[0];
        if (!user) {
          res.status(401).json({ error: 'Invalid credentials' });
        } else {
          // Compare the provided password with the hashed password from the database
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
          } else {
            // Issue a JWT token on successful login
            const token = jwt.sign({ userId: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
            res.json({ token });
          }
        }
      }
    });
  });
  