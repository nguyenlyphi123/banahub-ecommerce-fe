import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../contexts/AuthContext';

import '../authenticate.css';

export default function RegisterPage() {
  // Register data
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    confirm: '',
  });

  const handleChangeRegisterData = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // context
  const { customerRegister } = useContext(AuthContext);

  const handleRegisterSubmit = async () => {
    if (registerData.password !== registerData.confirm) {
      setMessage('Xác nhận tài khoản không đúng !!!');
      setAlert(true);
      setIsSuccess(false);
      return;
    }

    if (registerData.password.length < 6) {
      setMessage('Mật khẩu phải nhiều hơn 6 ký tự !!!');
      setAlert(true);
      setIsSuccess(false);
      return;
    }

    if (!registerData.username.includes('@')) {
      setMessage('Email không đúng định dạng !!!');
      setAlert(true);
      setIsSuccess(false);
      return;
    }

    if (
      !registerData.name ||
      !registerData.username ||
      !registerData.password ||
      !registerData.confirm
    ) {
      setMessage('Phải điền tất cả các trường !!!');
      setAlert(true);
      setIsSuccess(false);
      return;
    }

    try {
      const register = await customerRegister(registerData);

      if (register.success) {
        setMessage('Đăng ký tài khoản thành công! ');
        setAlert(true);
        setIsSuccess(true);
      }
    } catch (error) {
      setMessage('Đăng ký tài khoản thất bại !!!');
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
    <div className='container-fluid'>
      <div className='cont'>
        <div className='form sign-up d-flex justify-content-center align-items-center flex-column'>
          {alert
            ? isSuccess
              ? SuccessAlert(message)
              : DangerAlert(message)
            : ''}

          <h2>Time to feel like home</h2>
          <label className='login-label'>
            <span>Name</span>
            <input
              onChange={(e) => handleChangeRegisterData(e)}
              className='login-input'
              type='text'
              name='name'
              value={registerData.name}
            />
          </label>
          <label className='login-label'>
            <span>Email</span>
            <input
              onChange={(e) => handleChangeRegisterData(e)}
              className='login-input'
              type='email'
              name='username'
              value={registerData.username}
            />
          </label>
          <label className='login-label'>
            <span>Password</span>
            <input
              onChange={(e) => handleChangeRegisterData(e)}
              className='login-input'
              type='password'
              name='password'
              value={registerData.password}
            />
          </label>
          <label className='login-label'>
            <span>Confirm Password</span>
            <input
              onChange={(e) => handleChangeRegisterData(e)}
              className='login-input'
              type='password'
              name='confirm'
              value={registerData.confirm}
            />
          </label>
          <button
            onClick={() => handleRegisterSubmit()}
            type='button'
            className='login-button submit'
          >
            Sign Up
          </button>
        </div>
        <div className='sub-cont'>
          <div className='img'>
            <div className='img__text m--in'>
              <h2>One of us?</h2>
              <p>
                If you already has an account, just sign in. We've missed you!
              </p>
            </div>
            <Link to='/login'>
              <div className='img__btn'>
                <span className='m--in'>Sign In</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
