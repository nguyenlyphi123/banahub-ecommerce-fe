export const authReducer = (state, action) => {
  const {
    type,
    payload: { authLoading, isAuthenticated, customer, employee, admin },
  } = action;

  switch (type) {
    case 'SET_AUTH':
      return {
        ...state,
        authLoading,
        isAuthenticated,
        customer,
        employee,
        admin,
      };

    default:
      break;
  }
};
