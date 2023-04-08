import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../contexts/AuthContext';

import '../authenticate.css';

export default function LoginPage() {
  // context
  const { customerLogin } = useContext(AuthContext);

  const {
    authState: { isAuthenticated, customer },
  } = useContext(AuthContext);

  // redirect if logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && customer) navigate('/');
  });

  // login data
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChangeLoginData = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // handle login submit
  const handleLoginSubmit = async () => {
    if (!loginData.username || !loginData.password) {
      setMessage('Cần điền tất cả các trường !!!');
      setAlert(true);
      setIsSuccess(false);
      return;
    }

    try {
      const login = await customerLogin(loginData);

      if (login.success) navigate('/');
      else {
        setMessage('Tên đăng nhập hoặc tài khoản không đúng !!!');
        setAlert(true);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Tên đăng nhập hoặc tài khoản không đúng !!!');
      setAlert(true);
      setIsSuccess(false);
    }
  };

  // alert
  const [alert, setAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const SuccessAlert = (message) => {
    return (
      <>
        <div class='alert alert-success pt-1 pb-1'>
          {message}{' '}
          <strong>
            <Link to='/login'> Bấm để đăng nhập</Link>
          </strong>
        </div>
      </>
    );
  };

  const DangerAlert = (message) => {
    return (
      <>
        <div class='alert alert-danger alert-dismissible pt-1 pb-1'>
          <button
            onClick={() => {
              setAlert(false);
            }}
            type='button'
            class='close pt-1 pb-1'
            data-dismiss='alert'
          >
            &times;
          </button>
          {message}
        </div>
      </>
    );
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='cont'>
          <div className='form sign-in d-flex justify-content-center align-items-center flex-column'>
            {alert
              ? isSuccess
                ? SuccessAlert(message)
                : DangerAlert(message)
              : ''}
            <h2>Welcome back</h2>
            <label className='login-label'>
              <span>Email</span>
              <input
                onChange={(e) => handleChangeLoginData(e)}
                className='login-input'
                type='email'
                name='username'
              />
            </label>
            <label className='login-label'>
              <span>Password</span>
              <input
                onChange={(e) => handleChangeLoginData(e)}
                className='login-input'
                type='password'
                name='password'
              />
            </label>
            <p className='forgot-pass'>Forgot password?</p>
            <button
              onClick={() => handleLoginSubmit()}
              className='login-button submit'
            >
              Sign In
            </button>
          </div>
          <div className='sub-cont'>
            <div className='img'>
              <div className='img__text m--up'>
                <h2>New here?</h2>
                <p>Sign up and discover great amount of new opportunities!</p>
              </div>
              <Link to='/register'>
                <div className='img__btn'>
                  <span className='m--up'>Sign Up</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
