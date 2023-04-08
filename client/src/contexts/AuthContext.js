import { createContext, useEffect, useReducer } from 'react';
import { authReducer } from '../context-reducer/authReducer';
import axios from 'axios';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from './constants';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    customer: null,
    employee: null,
    admin: false,
  });

  // Logout
  const logout = () => {
    try {
      dispatch({
        type: 'SET_AUTH',
        payload: {
          authLoading: true,
          isAuthenticated: false,
          customer: null,
          employee: null,
          admin: false,
        },
      });

      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Authorization customer
  const loadCustomer = async () => {
    // localStorage.removeItem(LOCAL_STORAGE_ADMIN_ACCESS_TOKEN);
    // localStorage.removeItem(LOCAL_STORAGE_ADMIN_NAME);

    if (localStorage[LOCAL_STORAGE_ACCESS_TOKEN])
      setAuthToken(localStorage[LOCAL_STORAGE_ACCESS_TOKEN]);

    try {
      let response = await axios.get(`${apiURL}/account/customer`);
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            authLoading: false,
            isAuthenticated: true,
            customer: response.data.customerData,
            employee: null,
            admin: false,
          },
        });
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
      setAuthToken(null);
      dispatch({
        type: 'SET_AUTH',
        payload: {
          authLoading: true,
          isAuthenticated: false,
          customer: null,
          employee: null,
          admin: false,
        },
      });
    }
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  // Customer login
  const customerLogin = async (customer) => {
    try {
      const response = await axios.post(`${apiURL}/account/login`, customer);

      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            authLoading: false,
            isAuthenticated: true,
            customer: response.data.customerData,
            employee: null,
            admin: false,
          },
        });

        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_TOKEN,
          response.data.accessToken,
        );
      }

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  // Customer register
  const customerRegister = async (customer) => {
    try {
      const response = await axios.post(`${apiURL}/account/register`, customer);

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  // Employee
  const loadEmployee = async () => {
    // localStorage.removeItem(LOCAL_STORAGE_ADMIN_ACCESS_TOKEN);
    // localStorage.removeItem(LOCAL_STORAGE_ADMIN_NAME);

    if (localStorage[LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE])
      setAuthToken(localStorage[LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE]);

    try {
      let response = await axios.get(`${apiURL}/account/employee`);
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            authLoading: false,
            isAuthenticated: true,
            customer: null,
            employee: response.data.employeeData,
            admin: false,
          },
        });
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE);
      setAuthToken(null);
      dispatch({
        type: 'SET_AUTH',
        payload: {
          authLoading: true,
          isAuthenticated: false,
          customer: null,
          employee: null,
          admin: false,
        },
      });
    }
  };

  useEffect(() => {
    loadEmployee();
  }, []);

  // Employee login
  const employeeLogin = async (employee) => {
    try {
      const response = await axios.post(
        `${apiURL}/account/employee/login`,
        employee,
      );

      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            authLoading: false,
            isAuthenticated: true,
            employee: response.data.employeeData,
            admin: false,
          },
        });

        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
          response.data.accessToken,
        );
      }

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  // update promotion status
  const promotionStatusUpdate = async () => {
    try {
      axios.put(`${apiURL}/promotion`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    promotionStatusUpdate();
  }, []);

  // Context data
  const authContextData = {
    authState,
    customerLogin,
    customerRegister,
    logout,
    employeeLogin,
  };

  // Return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

// Export provider
export default AuthContextProvider;
