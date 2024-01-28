import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateCartItem: () => {},
});

const shoppingCartReducer = (state, action) => {
    if (action.type === 'ADD-ITEM') {
        const id = action.payload;
        
          const updatedItems = [...state.items];

          const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === id
          );
          const existingCartItem = updatedItems[existingCartItemIndex];

          if (existingCartItem) {
            const updatedItem = {
              ...existingCartItem,
              quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
          } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === id);
            updatedItems.push({
              id: id,
              name: product.title,
              price: product.price,
              quantity: 1,
            });
          }

          return {
            items: updatedItems,
          };
        
    }
    if (action.type === 'UPDATE-ITEM') {
        
          const updatedItems = [...state.items];
          const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
          );

          const updatedItem = {
            ...updatedItems[updatedItemIndex],
          };

          updatedItem.quantity += action.payload.amount;

          if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
          } else {
            updatedItems[updatedItemIndex] = updatedItem;
          }

          return {
            items: updatedItems,
          };
        
    }
  return state;
};

export function CartContextProvider({ children }) {
  const [shoppingCartState, ShoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

    
    function handleAddItemToCart(id) {
        ShoppingCartDispatch({
            type: 'ADD-ITEM',
            payload:id
      })
    
  }

  function handleUpdateCartItemQuantity(productId, amount) {
      ShoppingCartDispatch({
          type: 'UPDATE-ITEM',
          payload: {
              productId,
              amount
          }
    })
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItem: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
