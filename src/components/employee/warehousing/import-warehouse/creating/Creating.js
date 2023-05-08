import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../../contexts/constants';
import { storage } from '../../../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import ScrollToTop from '../../../../../ScrollToTop';

export default function Creating() {
  // prepare data
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
  const [typeChoosed, setTypeChoosed] = useState();

  const handleSelectType = (type) => {
    setTypeChoosed(type._id);
    setLTypeChoosed();
    setBrandChoosed();
  };

  const [ltypeChoosed, setLTypeChoosed] = useState();

  const handleSelectLType = (ltype) => {
    setLTypeChoosed(ltype._id);
    setBrandChoosed();
  };

  const [brandChoosed, setBrandChoosed] = useState();
  const handleSelectBrand = (brand) => {
    setBrandChoosed(brand._id);
  };

  // handle product detail info
  const [productData, setProductData] = useState({
    name: '',
    describe: '',
    quantity: 0,
    price: 0,
  });

  const handleSetProductData = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
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

  // handle submit
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    const imgURL = await handleUpload();

    if (imgURL) {
      if (!typeChoosed) {
        setAlertFalse('Vui lòng chọn loại cho sản phẩm');
        return;
      }

      if (
        !productData.name ||
        !productData.describe ||
        !productData.price ||
        !productData.quantity
      ) {
        setAlertFalse('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const requestData = {
        name: productData.name,
        describe: productData.describe,
        quantity: parseInt(productData.quantity),
        price: parseInt(productData.price),
        type: typeChoosed,
        ...(ltypeChoosed ? { sub_type: ltypeChoosed } : {}),
        ...(brandChoosed ? { brand: brandChoosed } : {}),
        image: imgURL,
      };

      try {
        const response = await axios.post(
          `${apiURL}/product/create`,
          requestData,
          {
            headers: headers,
          },
        );

        if (response.data.success) {
          setAlertSuccess('Sản phẩm đã được thêm vào cửa hàng');
          handleResetData();
          setSubmitSuccess(true);
        }
      } catch (error) {
        console.log(error);
        setAlertFalse(
          'Hiện tại không thể tạo sản phẩm, xin vui lòng thử lại sau',
        );
      }
    } else {
      setAlertFalse('Vui lòng chọn ảnh bìa cho sản phẩm');
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
    setSubmitSuccess(false);
  };

  const handleResetData = () => {
    setFile();
    setProductData({
      name: '',
      describe: '',
      quantity: 0,
      price: 0,
    });
    setPercent(0);
  };

  return (
    <>
      <ScrollToTop dataFetchSuccess={submitSuccess} />
      <div className='wh-import-container'>
        <div className='wh-import-new-container mt-3'>
          {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}
          <div className='whi-new-header'>Thêm sản phẩm mới</div>
          <div className='whi-new-form'>
            <div className='whi-info-label'>Thông tin cơ bản</div>
            <div className='row'>
              <div className='whi-nf-chooser-container col-4'>
                <p className='whi-nf-label'>Chọn loại sản phẩm</p>
                <div className='whi-nf-type-list'>
                  {types.map((type) => (
                    <div
                      key={type._id}
                      onClick={() => handleSelectType(type)}
                      className={`whi-dropdown-item ${
                        type._id === typeChoosed ? 'checked' : ''
                      }`}
                    >
                      {type.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className='whi-nf-chooser-container col-4'>
                <p className='whi-nf-label'>Chọn nhánh sản phẩm</p>
                <div className='whi-nf-ltype-list'>
                  {ltypes
                    .filter((ltype) => ltype.h_type_id._id === typeChoosed)
                    .map((ltype) => {
                      return (
                        <div
                          onClick={() => handleSelectLType(ltype)}
                          className={`whi-dropdown-item ${
                            ltype._id === ltypeChoosed ? 'checked' : ''
                          }`}
                        >
                          {ltype.name}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className='whi-nf-chooser-container col-4'>
                <p className='whi-nf-label'>Chọn thương hiệu</p>
                <div className='whi-nf-brand-list'>
                  {ltypeChoosed
                    ? brands
                        .filter((brand) => brand.sub_type === ltypeChoosed)
                        .map((brand) => {
                          return (
                            <div
                              onClick={() => handleSelectBrand(brand)}
                              className={`whi-dropdown-item ${
                                brand._id === brandChoosed ? 'checked' : ''
                              }`}
                            >
                              {brand.name}
                            </div>
                          );
                        })
                    : brands
                        .filter((brand) => {
                          if (brand.sub_type) {
                            return brand.sub_type === ltypeChoosed;
                          } else {
                            return brand.type === typeChoosed;
                          }
                        })
                        .map((brand) => {
                          return (
                            <div
                              onClick={() => handleSelectBrand(brand)}
                              className={`whi-dropdown-item ${
                                brand._id === brandChoosed ? 'checked' : ''
                              }`}
                            >
                              {brand.name}
                            </div>
                          );
                        })}
                </div>
              </div>
            </div>

            <div className='whi-new-info d-flex justify-content-center align-items-center flex-column'>
              <div className='whi-info-label w-100'>Thông tin chi tiết</div>
              <div className='whi-detail-info-container d-flex justify-content-center align-items-center flex-column mt-4'>
                <div className='whi-nf-name d-flex align-items-center m-1'>
                  <p className='whi-nf-input-label m-0'>Tên sản phẩm</p>
                  <div className='whi-nf-input'>
                    <input
                      onChange={(e) => handleSetProductData(e)}
                      type='text'
                      name='name'
                      value={productData.name}
                      placeholder='Nhập tên sản phẩm'
                    />
                  </div>
                </div>

                <div className='whi-nf-describe d-flex m-1'>
                  <p className='whi-nf-input-label m-0'>Mô tả</p>
                  <div className='whi-nf-input'>
                    <textarea
                      onChange={(e) => handleSetProductData(e)}
                      name='describe'
                      value={productData.describe}
                      placeholder='Nhập mô tả sản phẩm'
                    />
                  </div>
                </div>

                <div className='whi-nf-price d-flex align-items-center m-1'>
                  <p className='whi-nf-input-label m-0'>Giá</p>
                  <div className='whi-nf-input'>
                    <input
                      onChange={(e) => handleSetProductData(e)}
                      type='number'
                      name='price'
                      value={productData.price}
                      min='1'
                      step='100000'
                    />
                  </div>
                </div>

                <div className='whi-nf-quantity d-flex align-items-center m-1'>
                  <p className='whi-nf-input-label m-0'>Số lượng</p>
                  <div className='whi-nf-input'>
                    <input
                      onChange={(e) => handleSetProductData(e)}
                      type='number'
                      name='quantity'
                      value={productData.quantity}
                      min='1'
                    />
                  </div>
                </div>

                <div className='whi-nf-image d-flex m-1'>
                  <p className='whi-nf-input-label m-0'>Ảnh bìa</p>
                  <div className='whi-nf-input border-0 p-0 mt-1'>
                    <div className='image-box'>
                      {file ? (
                        <div className='image-choose-tmp-box'>
                          <img
                            className='image-choose-tmp'
                            src={URL.createObjectURL(file)}
                            alt='Selected file'
                          />
                        </div>
                      ) : (
                        ''
                      )}

                      <label className='image-wrapper' for='image'>
                        <i class='fas fa-plus'></i>
                      </label>

                      <input
                        onChange={(e) => handleFileChange(e)}
                        id='image'
                        className='image-input'
                        type='file'
                      />

                      {percent !== 0 ? <p>{percent} %</p> : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='text-end'>
            <div onClick={handleSubmit} className='btn btn-dark'>
              Xác nhận
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
