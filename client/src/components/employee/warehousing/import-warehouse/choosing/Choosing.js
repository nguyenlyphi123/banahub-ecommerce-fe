import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../../contexts/constants';

export default function Choosing() {
  // get product data
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/product`)
        .then((res) => setProducts(res.data.products))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // chooser popup
  const [isChooserPopup, setIsChooserPopup] = useState(false);

  const ChooserPopup = () => {
    return (
      <>
        <div
          onClick={() => setIsChooserPopup(false)}
          className={`c-popup-container`}
        >
          <div className='c-popup-wrapper'>
            <div className='c-popup-header'>Danh sách sản phẩm</div>

            <div className='c-popup-seach'>
              <input
                onChange={handleSearch}
                type='text'
                value={search}
                placeholder='Nhập mã sản phẩm'
              />
              <span>
                <i className='fas fa-search'></i>
              </span>
            </div>

            <div className='c-popup-product-list'>
              {products
                .filter((item) =>
                  productChoosed.length > 0
                    ? !productChoosed.find(
                        (exists) => exists.product._id === item._id,
                      )
                    : item,
                )
                .filter((item) =>
                  search === '' ? item : item._id.toString().includes(search),
                )
                .map((item, index) => {
                  return (
                    <div
                      onClick={() => handleProductChoose(item)}
                      key={index}
                      className='c-popup-product-item p-2'
                    >
                      <div className='cpd-image text-center'>
                        <img src={item.image} alt='' />
                      </div>

                      <div className='cpd-code'>Mã: {item._id}</div>

                      <div className='cpd-quantity'>
                        Còn lại: {item.quantity - item.sold}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className='c-popup-button'>
              <div
                onClick={() => setIsChooserPopup(false)}
                className='cpb-cancel btn btn-dark'
              >
                Thoát
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // handle search
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // handle product choose
  const [productChoosed, setProductChoosed] = useState([]);

  const handleProductChoose = (product) => {
    setProductChoosed([...productChoosed, { product: product, quantity: 1 }]);
    setIsChooserPopup(false);
  };

  const handleChangeQuantity = (id, value) => {
    const productExists = productChoosed.find(
      (item) => item.product._id === id,
    );

    if (productExists) {
      setProductChoosed(
        productChoosed.map((item) =>
          item.product._id === id
            ? { ...productExists, quantity: parseInt(value) }
            : item,
        ),
      );
    }
  };

  const handleDelete = (id) => {
    setProductChoosed(productChoosed.filter((item) => item.product._id !== id));
  };

  // handle submit
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.post(
        `${apiURL}/product/import`,
        {
          importData: productChoosed,
        },
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess('Đã cập nhật số lượng thành công');
        setProductChoosed([]);
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Không thể cập nhật sản phẩm');
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const SuccessAlert = () => {
    return (
      <div className='alert alert-success alert-dismissible'>
        <button
          onClick={() => {
            handleResetAlert();
          }}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Thành công!</strong> {message}
      </div>
    );
  };

  const DangerAlert = () => {
    return (
      <div className='alert alert-danger alert-dismissible'>
        <button
          onClick={handleResetAlert}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Lỗi!</strong> {message}
      </div>
    );
  };

  const setAlertSuccess = (message) => {
    setIsPopup(true);
    setIsSuccess(true);
    setMessage(message);
  };

  const setAlertFalse = (message) => {
    setIsPopup(true);
    setIsSuccess(false);
    setMessage(message);
  };

  const handleResetAlert = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setMessage('');
  };

  return (
    <>
      <div className='wh-import-container'>
        {isChooserPopup ? ChooserPopup() : ''}
        <div className='wh-import-chooser-container'>
          {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}
          <div className='whi-chooser-header'>Chọn sản phẩm</div>
          <div className='whi-chooser-container row justify-content-center'>
            {productChoosed?.map((item) => {
              return (
                <div className='whi-choosed-item m-2 col-2'>
                  <div
                    onClick={() => handleDelete(item.product._id)}
                    className='whi-choosed-delete'
                  >
                    <i className='fas fa-times-circle'></i>
                  </div>

                  <div className='whi-choosed-image'>
                    <img src={item.product.image} alt='' />
                  </div>

                  <div className='whi-choosed-code'>Mã: {item.product._id}</div>

                  <div className='whi-choosed-quantity'>
                    QTY:
                    <div className='whi-choosed-input'>
                      <input
                        onChange={(e) =>
                          handleChangeQuantity(item.product._id, e.target.value)
                        }
                        type='number'
                        name=''
                        value={item.quantity}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => setIsChooserPopup(true)}
              className='whi-chooser-box d-flex justify-content-center align-items-center m-2 col-2'
            >
              <i className='fas fa-plus'></i>
            </div>
          </div>

          <div className='whi-choose-button text-end mt-2'>
            <Link className='btn btn-dark' to='create'>
              Hoặc thêm sản phẩm mới
            </Link>

            <div onClick={handleSubmit} className='btn pr-4 pl-4 ml-2'>
              Xác nhận
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
