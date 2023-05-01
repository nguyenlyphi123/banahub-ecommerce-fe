export const apiURL =
  process.env.NODE_ENV !== 'production'
    ? 'https://banahub-ecommerce-be.onrender.com/api'
    : 'http://localhost:8000/api';

export const LOCAL_STORAGE_ACCESS_TOKEN = 'AccessToken';
export const LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE = 'EmployeeAccessToken';
