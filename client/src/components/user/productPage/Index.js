import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/reducers/cartSlice';

import { FaStar } from 'react-icons/fa';
import ProductComment from './comment/ProductComment';
import { apiURL } from '../../../contexts/constants';

const colors = {
  yellow: '#ffc107',
  grey: '#a9a9a9',
};

export default function ProductPage() {
  // redux
  const dispatch = useDispatch();

  // handle addToCart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const location = useLocation();
  let product = location.state.product;

  const [quantity, setQuatity] = useState();

  useEffect(() => {
    axios
      .put(`${apiURL}/product/view/${product._id}`)
      .then((res) => {
        console.log(res.data.product);
      })
      .catch((err) => console.log(err));
    // console.log(product.quantity);
    // initFacebookSDK();
  }, [product]);

  // get comments
  const [starAverage, setStarAverage] = useState(0);
  const [comment, setComment] = useState([]);
  const [commentTrigger, setCommentTrigger] = useState(false);

  useEffect(() => {
    axios.get(`${apiURL}/rating/${product._id}`).then((res) => {
      setComment(res.data.ratings);

      let startTmp = 0;
      res.data.ratings.forEach((e) => {
        startTmp += e.rating;
      });

      setStarAverage(startTmp / res.data.ratings.length);
    });
  }, [commentTrigger]);

  const handleCommentSuccess = () => {
    setCommentTrigger(!commentTrigger);
  };

  const OutOfProduct = () => {
    return (
      <div
        className='d-flex'
        style={{ marginTop: '1.3rem', marginLeft: '10px', width: '70%' }}
      >
        <button
          className='btn btn-outline-danger'
          style={{ padding: '3px .75rem' }}
        >
          <i className='fas fa-shopping-cart' /> Sản phẩm tạm hết hàng
        </button>
      </div>
    );
  };

  const StillHaveProduct = (item) => {
    return (
      <div
        className='d-flex'
        style={{ marginTop: '1.3rem', marginLeft: '10px', width: '70%' }}
      >
        <button
          onClick={() => handleAddToCart(item)}
          className='btn btn-outline-danger'
          style={{ padding: '3px .75rem' }}
        >
          <i className='fas fa-shopping-cart' /> Thêm vào giỏ hàng
        </button>
      </div>
    );
  };

  const shopNow = (item) => {
    return (
      <div className='list-group-item text-center col-sm-12 col-lg-7 border-top border-left-0'>
        <Link
          onClick={() => handleAddToCart(item)}
          to='/cart'
          className='btn'
          style={{
            maxWidth: '15rem',
            backgroundColor: '#940f0f',
            color: '#fff',
            padding: '0.375rem 2rem !important',
          }}
        >
          ĐẶT MUA NGAY
        </Link>
      </div>
    );
  };

  const cantShopNow = () => {
    return (
      <div className='list-group-item text-center col-sm-12 col-lg-7 border-top border-left-0'>
        <Link
          to='/register'
          className='btn'
          style={{
            backgroundColor: '#940f0f',
            color: '#fff',
            padding: '0.375rem 2rem !important',
          }}
        >
          ĐĂNG KÝ ĐỂ NHẬN THÔNG TIN
        </Link>
      </div>
    );
  };

  const formatter = new Intl.NumberFormat('en');
  const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 368970104649269,
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v12.0', // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/vi_VN/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  };

  return (
    <>
      <div className='container-fluid container-center'>
        <div className='sub-container' style={{ width: '90%' }}>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-4'>
              <img
                className='img-responsive'
                src={product.image}
                alt=''
                style={{
                  maxWidth: '250px',
                  maxHeight: '250px',
                  marginLeft: '30px',
                }}
              />
            </div>
            <div className='col-sm-12 col-md-9 col-lg-8'>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '2em',
                  color: '#be9329',
                }}
              >
                {product.name}
              </p>
              <hr />
              <ul className='list-group list-group-horizontal'>
                <li id='proID' className='list-group-item list-border'>
                  Mã sản phẩm: {product._id}
                </li>
                <li className='list-group-item list-border'>
                  Đánh giá:{' '}
                  {(() => {
                    let tmp = [];
                    for (let i = 1; i <= starAverage; i++) {
                      tmp.push(<FaStar key={i} color={colors.yellow} />);
                    }

                    for (let i = starAverage; i < 5; i++) {
                      tmp.push(<FaStar key={i + 1} color={colors.grey} />);
                    }

                    return tmp;
                  })()}
                </li>
                <li
                  className='list-group-item list-border'
                  style={{
                    border: '0px !important',
                  }}
                >
                  Còn lại: {product.quantity - product.sold}
                </li>
                <li
                  className='list-group-item list-border'
                  style={{
                    border: '0px !important',
                  }}
                >
                  Lượt xem: {product.view}
                </li>
              </ul>
              <div
                className='mota'
                style={{ width: '60%', transform: 'translateX(10px)' }}
              >
                <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  Thông tin sản phẩm
                </p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{product.describe}</p>
              </div>

              {product.quantity - product.sold <= 0
                ? OutOfProduct()
                : StillHaveProduct(product)}

              <div
                className='list-group list-group-horizontal'
                style={{ marginTop: '2rem' }}
              >
                <div className='row' style={{ width: '100%' }}>
                  <div
                    className='list-group-item text-center col-sm-12 col-lg-5 border-right-0'
                    style={{
                      color: '#940f0f',
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatter.format(product.price)} VNĐ
                  </div>

                  {product.quantity - product.sold <= 0
                    ? cantShopNow()
                    : shopNow(product)}
                </div>
              </div>
            </div>

            <div
              className='comments p-3 col-12'
              style={{
                marginTop: '2rem',
                border: '1px solid rgba(200, 200, 200, .5)',
                paddingTop: '15px',
              }}
            >
              <div className='comment-content'>
                <p style={{ fontWeight: 600, fontSize: '1.5em' }}>
                  Đánh giá sản phẩm
                </p>
                <hr />
              </div>

              <ProductComment
                comment={comment}
                handleCommentSuccess={handleCommentSuccess}
                product_id={product._id}
              />
            </div>
            {/* <FacebookComment /> */}
          </div>
        </div>
      </div>
    </>
  );
}
