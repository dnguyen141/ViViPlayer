const initialState = {
  //   token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  theanh: 'abc in store'
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}

export default authReducer;
