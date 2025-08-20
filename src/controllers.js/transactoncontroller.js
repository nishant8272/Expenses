import { sql } from "../config/db.js";

export async function postTransaction(req,res) {
     const { user_id, title, amount, category } = req.body;
      if (!user_id || !title || !amount || !category) {
        return res.status(400).json({ error: 'All fields are required' });
      }
     try {
       const result = await sql`INSERT INTO expenses (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
       res.status(201).json(result[0]);
     } catch (error) {
       console.error('Error inserting transaction:', error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
    }
    
export async  function getTransactionsByUserId(req, res) {
      try {
        const { userId } = req.params;
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const result = await sql`SELECT * FROM expenses WHERE user_id = ${userId} ORDER BY created_at DESC`;
        
        res.status(200).json(result);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } 
    }

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const result = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully', transaction: result[0] });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
}

export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) AS balance FROM expenses WHERE user_id = ${userId}`;

    const incomeResult = await sql`SELECT COALESCE(SUM(amount),0) AS income FROM expenses
     WHERE user_id = ${userId} AND amount > 0`;

    const expenseResult = await sql`SELECT COALESCE(SUM(amount),0) AS expense FROM expenses
     WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });

  } catch (error) {
    console.error('Error summary transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
