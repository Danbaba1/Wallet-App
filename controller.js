// index.js
const pool = require('./databaseconnection');
const authenticateJWT = require('./index');

// Get wallet balance
app.get('/wallet/balance', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
  
   
  });
  
  // Deposit funds to the wallet
  app.post('/wallet/deposit', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;
  
    // Update the balance in the 'wallets' table for the user_id
    const depositQuery = `
      UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING *
    `;
  
    pool.query(depositQuery, [amount, userId], (err, result) => {
      if (err) {
        console.error('Error depositing funds:', err);
        res.status(500).json({ error: 'Error depositing funds' });
      } else {
        const newBalance = result.rows[0]?.balance || 0;
        res.json({ balance: newBalance });
      }
    });
  });
  
  // Withdraw funds from the wallet
  app.post('/wallet/withdraw', authenticateJWT, (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;
  
    // Check if the withdrawal amount exceeds the wallet balance
    const checkBalanceQuery = `
      SELECT balance FROM wallets WHERE user_id = $1
    `;
  
    pool.query(checkBalanceQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error checking wallet balance:', err);
        res.status(500).json({ error: 'Error checking wallet balance' });
      } else {
        const currentBalance = result.rows[0]?.balance || 0;
  
        if (currentBalance >= amount) {
          // Update the balance in the 'wallets' table for the user_id
          const withdrawQuery = `
            UPDATE wallets SET balance = balance - $1 WHERE user_id = $2 RETURNING *
          `;
  
          pool.query(withdrawQuery, [amount, userId], (err, result) => {
            if (err) {
              console.error('Error withdrawing funds:', err);
              res.status(500).json({ error: 'Error withdrawing funds' });
            } else {
              const newBalance = result.rows[0]?.balance || 0;
              res.json({ balance: newBalance });
            }
          });
        } else {
          res.status(400).json({ error: 'Insufficient balance' });
        }
      }
    });
  });
  