import { formatNumberWithCommas } from '../common';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const CartDetails = ({ cart = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <TableCell>Product</TableCell>
            <TableCell align='right'>Category</TableCell>
            <TableCell align='right'>Price</TableCell>
            <TableCell align='right'>Quantity</TableCell>
            <TableCell align='right'>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map(({ id, name, price, quantity, category }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell align='right'>{category}</TableCell>
              <TableCell align='right'>
                {formatNumberWithCommas(price)}
              </TableCell>
              <TableCell align='right'>{quantity}</TableCell>
              <TableCell align='right'>
                {formatNumberWithCommas(price * quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CartDetails;
