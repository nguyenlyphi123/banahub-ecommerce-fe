import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import DailySaleLineChart from './chart/DailySaleLineChart';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import axios from 'axios';
import { storage } from '../../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import('./ProductDetail.css');

export default function ProductDetail() {
  // location for get product data
  const location = useLocation();
  const product = location.state.product;

  // get type data
  const [types, setType] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/type`)
        .then((res) => setType(res.data.types))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get ltype data
  const [ltypes, setLType] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/ltype`)
        .then((res) => setLType(res.data.ltypes))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get brand data
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/brand`)
        .then((res) => setBrands(res.data.brands))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // handle choose info
  const [typeChoosed, setTypeChoosed] = useState(product.type._id);

  const handleSelectType = (e) => {
    setTypeChoosed(e.target.value);
    setLTypeChoosed();
    setBrandChoosed();
  };

  const [ltypeChoosed, setLTypeChoosed] = useState(
    product.sub_type ? product.sub_type._id : undefined,
  );

  const handleSelectLType = (e) => {
    setBrandChoosed();
    setLTypeChoosed(e.target.value);
  };

  const [brandChoosed, setBrandChoosed] = useState(product.brand._id);
  const handleSelectBrand = (e) => {
    setBrandChoosed(e.target.value);
  };

  const [isTypeHaveChild, setIsTypeHaveChild] = useState(false);
  useEffect(() => {
    if (checkTypeHaveChild()) setIsTypeHaveChild(true);
    else setIsTypeHaveChild(false);
  }, [typeChoosed]);

  const checkTypeHaveChild = () => {
    if (ltypes.find((ltype) => ltype.h_type_id._id === typeChoosed))
      return true;

    return false;
  };

  // Firebase
  //upload image
  const [file, setFile] = useState();

  //progress
  const [percent, setPercent] = useState(0);

  //handle file upload event and update state
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  const handleUpload = async () => {
    if (!file) {
      setAlertFalse('Vui lòng chọn ảnh bìa cho sản phẩm');
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
      const uploadImage = new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );

            // update progress
            setPercent(percent);
          },
          (err) => {
            console.log(err);
          },
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              url !== null ? resolve(url) : reject('lỗi');
            });
          },
        );
      });
      return uploadImage;
    } catch (error) {
      console.log(error);
    }
  };

  // prepare data
  const [updateProductData, setUpdateProductData] = useState(product);

  const handleUpdateProductData = (e) => {
    setUpdateProductData({
      ...updateProductData,
      [e.target.name]: e.target.value,
    });
  };

  // hanldeSubmit
  const handleSubmit = async () => {
    if (!typeChoosed) {
      setAlertFalse('Vui lòng chọn loại cho sản phẩm');
      return;
    }

    if (updateProductData.name === '' || updateProductData.describe === '') {
      setAlertFalse('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    if (file) {
      const imgURL = await handleUpload();
      if (imgURL) {
        try {
          const response = await axios.put(
            `${apiURL}/product/${product._id}`,
            {
              name: updateProductData.name,
              describe: updateProductData.describe,
              price: updateProductData.price,
              type: typeChoosed,
              ...(ltypeChoosed ? { sub_type: ltypeChoosed } : {}),
              ...(brandChoosed ? { brand: brandChoosed } : {}),
              image: imgURL,
            },
            { headers: headers },
          );

          if (response.data.success) {
            setAlertSuccess('Sản phẩm đã được cập nhật');
          }
        } catch (error) {
          console.log(error);
          setAlertFalse(
            'Hiện tại không thể cập nhật sản phẩm, xin vui lòng thử lại sau',
          );
        }
      } else {
        setAlertFalse('Vui lòng chọn ảnh bìa cho sản phẩm');
      }
    } else {
      try {
        const response = await axios.put(
          `${apiURL}/product/${product._id}`,
          {
            name: updateProductData.name,
            describe: updateProductData.describe,
            price: updateProductData.price,
            type: typeChoosed,
            ...(ltypeChoosed ? { sub_type: ltypeChoosed } : {}),
            ...(brandChoosed ? { brand: brandChoosed } : {}),
            image: updateProductData.image,
          },
          { headers: headers },
        );

        if (response.data.success) {
          setAlertSuccess('Sản phẩm đã được cập nhật');
        }
      } catch (error) {
        console.log(error);
        setAlertFalse(
          'Hiện tại không thể cập nhật sản phẩm, xin vui lòng thử lại sau',
        );
      }
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

  const handleResetData = () => {
    setFile();
    setPercent(0);
  };

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  // update product
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <>
      <div className='w-product-container'>
        <div className='w-product-header'>Chi tiết sản phẩm</div>

        {isUpdate ? (
          <div className='w-product-detail-container row'>
            {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}

            <div className='wp-image d-flex justify-content-center align-items-center flex-column col-6'>
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=''
                  style={{ width: '300px', height: '300px' }}
                />
              ) : (
                <img
                  src={updateProductData.image}
                  alt=''
                  style={{ width: '300px', height: '300px' }}
                />
              )}

              <div className='wp-chooser-container'>
                <label className='wp-image-wrapper' for='image'></label>

                <input
                  onChange={(e) => handleFileChange(e)}
                  id='image'
                  className='image-input'
                  type='file'
                />
              </div>
            </div>
            <div className='wp-detail pt-2 col-6'>
              <div className='wp-name border-0 d-flex justify-content-between align-items-center'>
                Tên sản phẩm
                <div className='wp-input-wrapper'>
                  <input
                    onChange={handleUpdateProductData}
                    type='text'
                    name='name'
                    value={updateProductData.name}
                  />
                </div>
              </div>
              <div className='wp-price d-flex justify-content-between align-items-center'>
                Giá
                <div className='wp-input-wrapper'>
                  <input
                    onChange={handleUpdateProductData}
                    type='number'
                    name='price'
                    min='1'
                    value={updateProductData.price}
                  />
                </div>
              </div>
              <div
                className='wp-describe d-flex justify-content-between'
                style={{ whiteSpace: 'pre-wrap' }}
              >
                Mô tả
                <div className='wp-input-wrapper'>
                  <textarea
                    onChange={handleUpdateProductData}
                    type='text'
                    name='describe'
                    value={updateProductData.describe}
                  />
                </div>
              </div>
              <div className='wp-type d-flex justify-content-between mt-3'>
                Loại:{' '}
                <div className='wp-input-wrapper'>
                  <select
                    onChange={handleSelectType}
                    className='wp-type-select'
                  >
                    {types.map((type) =>
                      type._id === product.type._id ? (
                        <option value={type._id} selected>
                          {type.name}
                        </option>
                      ) : (
                        <option value={type._id}>{type.name}</option>
                      ),
                    )}
                  </select>
                </div>
              </div>
              {isTypeHaveChild || product.sub_type ? (
                <div className='wp-stype d-flex justify-content-between mt-2'>
                  Nhánh:{' '}
                  <div className='wp-input-wrapper'>
                    <select
                      onChange={handleSelectLType}
                      className='wp-type-select'
                    >
                      <option value='' selected disabled>
                        Chọn nhánh
                      </option>
                      {ltypes
                        .filter((ltype) => ltype.h_type_id._id === typeChoosed)
                        .map((ltype) =>
                          ltype._id === product.sub_type?._id ? (
                            <option value={ltype._id} selected>
                              {ltype.name}
                            </option>
                          ) : (
                            <option value={ltype._id}>{ltype.name}</option>
                          ),
                        )}
                    </select>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className=' d-flex justify-content-between mt-2'>
                Thương hiệu:{' '}
                <div className='wp-input-wrapper'>
                  <select
                    onChange={handleSelectBrand}
                    className='wp-type-select'
                  >
                    <option value='' selected disabled>
                      Chọn thương hiệu
                    </option>

                    {product.sub_type || isTypeHaveChild ? (
                      ltypeChoosed ? (
                        brands
                          .filter((brand) => brand.sub_type === ltypeChoosed)
                          .map((brand) =>
                            brand._id === product.brand._id ? (
                              <option value={brand._id} selected>
                                {brand.name}
                              </option>
                            ) : (
                              <option value={brand._id}>{brand.name}</option>
                            ),
                          )
                      ) : (
                        <option value='' selected disabled>
                          Chọn thương hiệu
                        </option>
                      )
                    ) : (
                      brands
                        .filter((brand) => brand.type === product.type._id)
                        .map((brand) =>
                          brand._id === product.brand._id ? (
                            <option value={brand._id} selected>
                              {brand.name}
                            </option>
                          ) : (
                            <option value={brand._id}>{brand.name}</option>
                          ),
                        )
                    )}
                  </select>
                </div>
              </div>
              <div className='wp-button-container d-flex justify-content-end'>
                <div
                  onClick={() => setIsUpdate(false)}
                  className='wp-button-cancel btn btn-dark mr-2'
                >
                  Thoát
                </div>
                <div onClick={() => handleSubmit()} className='wp-button btn'>
                  Xác nhận
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='w-product-detail-container row'>
            <div className='wp-image d-flex justify-content-center col-6'>
              <img
                src={product.image}
                alt=''
                style={{ width: '300px', height: '300px' }}
              />
            </div>
            <div className='wp-detail col-6'>
              <div className='wp-brand'>{product.brand.name}</div>

              <div className='wp-name'>{product.name}</div>
              <div className='wp-price d-flex justify-content-between'>
                {formatter.format(product.price)} VNĐ
                <div className='wp-quantity'>
                  Còn lại: {product.quantity - product.sold}
                </div>
              </div>
              <div className='wp-describe' style={{ whiteSpace: 'pre-wrap' }}>
                <b style={{ color: 'rgba(0, 0, 0, 0.663)' }}>Mô tả sản phẩm:</b>{' '}
                {'\n'} {product.describe}
              </div>
              <div className='wp-type'>Loại: {product.type.name}</div>
              {product.sub_type ? (
                <div className='wp-stype'>Loại: {product.sub_type.name}</div>
              ) : (
                ''
              )}
              <div className='wp-createAt'>
                Ngày tạo: {moment(product.createAt).format('L')}
              </div>
              <div className='wp-button-container d-flex justify-content-center'>
                <div
                  onClick={() => setIsUpdate(true)}
                  className='wp-button btn'
                >
                  Cập nhật sản phẩm
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='product-detail-chart-container pl-4 pr-4'>
          <div className='w-product-header'>
            Thống kê số lượng bán trong tuần
          </div>
          <DailySaleLineChart product_id={product._id} />
        </div>
      </div>
    </>
  );
}
