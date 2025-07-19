import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view history.');
      return;
    }
    axios.get('http://localhost:5000/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistory(res.data))
      .catch(() => setError('Failed to load history.'));
  }, []);

  return (
    <Box maxWidth={700} mx="auto" mt={6} p={3} bgcolor="white" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={2} fontWeight={700} align="center">Query History</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Servings</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h, idx) => (
                <TableRow key={idx}>
                  <TableCell>{h.dish_name}</TableCell>
                  <TableCell>{h.servings_requested}</TableCell>
                  <TableCell>{new Date(h.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default History; 