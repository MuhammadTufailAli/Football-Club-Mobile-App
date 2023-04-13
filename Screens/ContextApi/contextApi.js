import React, {useState, createContext} from 'react';

const CartContext = createContext();

export function CartProvider({children}) {
  const [userdetails, setuserdetails] = useState([]);
  const [token, setToken] = useState('');
  const [socket, setsocket] = useState({});

  return (
    <CartContext.Provider
      value={{
        token,
        setToken,
        userdetails,
        setuserdetails,
        socket,
        setsocket,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
