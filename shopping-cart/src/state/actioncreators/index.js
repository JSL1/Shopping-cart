//state > actioncreators > index.js
export const addToCart = (product) => {
  return (dispatch) => {
    dispatch({
      type: 'addToCart',
      payload: product
    })
  }
}

export const removeFromCart = (product) => {
  return (dispatch) => {
    dispatch({
      type: "removeFromCart",
      payload: product
    })
  }
}