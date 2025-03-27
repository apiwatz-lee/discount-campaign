import { formarNumberWithCommas } from '../common';

const CartDetails = ({ cart = [] }) => {
  return (
    <table className='table-auto'>
      <thead>
        <tr>
          <th className='border px-4 py-2'>Product</th>
          <th className='border px-4 py-2'>Category</th>
          <th className='border px-4 py-2'>Price</th>
          <th className='border px-4 py-2'>Quantity</th>
          <th className='border px-4 py-2'>Total</th>
        </tr>
      </thead>
      <tbody>
        {cart?.map(({ id, name, price, quantity, category }) => (
          <tr key={id}>
            <td className='border px-4 py-2'>{name}</td>
            <td className='border px-4 py-2'>{category}</td>
            <td className='border px-4 py-2'>
              {formarNumberWithCommas(price)}
            </td>
            <td className='border px-4 py-2'>{quantity}</td>
            <td className='border px-4 py-2'>
              {formarNumberWithCommas(price * quantity)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CartDetails;
