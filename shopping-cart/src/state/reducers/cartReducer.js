//cartReducer.js
const reducer = (state = [], action) => {
  
  switch (action.type) {
    case "addToCart":
      console.log(action.payload);
      return [...state, action.payload];
    case "removeFromCart":
      const filteredState = state.filter(product => product.id !== action.payload);
      console.log(action.payload);
      return filteredState;
    default:
      return state;
  }
  
}

/*
const reducer = (state = 0, action) => {
  switch (action.type) {
    case "deposit":
      return state + action.payload;
    case "withdraw":
      return state - action.payload;
    default:
      return state
  }
}
*/

export default reducer;