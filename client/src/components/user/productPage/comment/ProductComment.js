import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import Moment from 'react-moment';
import './ProductComment.css';

const colors = {
  yellow: '#ffc107',
  grey: '#a9a9a9',
};

export default function ProductComment({ product_id }) {
  const [comment, setComment] = useState([]);
  const [commentData, setCommentData] = useState({
    author: {
      name: '',
      email: '',
    },
    content: '',
    rating: 1,
    product_id: product_id,
  });
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:6001/api/rating/${product_id}`).then((res) => {
      setComment(res.data.ratings);
    });
  }, [isClick]);

  const handleClick = (value) => {
    setCurrentValue(value);
    setCommentData({ ...commentData, rating: value });
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const stars = Array(5).fill(0);

  const addComment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:6001/api/rating/create',
        { commentData },
      );
      if (response) console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(commentData);
  };

  const handleAddComment = () => {
    addComment();
    setIsClick(!isClick);
  };

  return (
    <>
      <div className='rating p-3 mb-3 border'>
        <div className='your-rating d-flex flex-row'>
          <p>Chọn đánh giá của bạn</p>
          <div className='stars ml-3' onmouseout='CRateSelected()'>
            {stars.map((index, key) => {
              return (
                <FaStar
                  key={key}
                  onClick={() => handleClick(index + 1)}
                  style={{ marginLeft: '3px' }}
                  color={
                    (hoverValue || currentValue) > index
                      ? colors.yellow
                      : colors.grey
                  }
                  onMouseOver={() => handleMouseOver(index + 1)}
                  onMouseOut={handleMouseLeave}
                />
              );
            })}
          </div>
        </div>
        <div className='your-comment'>
          <textarea
            onChange={(e) =>
              setCommentData({ ...commentData, content: e.target.value })
            }
            value={commentData.comments}
            className='border comment-input-box p-3 mt-3'
            name='authorComment'
            style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
            placeholder='Nhận xét'
            required
          />
          <div className='contact d-flex flex-row row'>
            <div className='contact-name col-6'>
              <input
                onChange={(e) =>
                  setCommentData({
                    ...commentData,
                    author: { ...commentData.author, name: e.target.value },
                  })
                }
                value={commentData.author.name}
                className='border comment-input-box p-3'
                type='text'
                name='authorName'
                style={{ width: '100%', height: '40px' }}
                placeholder='Họ và tên'
                required
              />
            </div>
            <div className='contact-email col-6'>
              <input
                onChange={(e) =>
                  setCommentData({
                    ...commentData,
                    author: { ...commentData.author, email: e.target.value },
                  })
                }
                value={commentData.author.email}
                className='border comment-input-box p-3'
                type='email'
                name='authorEmail'
                style={{ width: '100%', height: '40px' }}
                placeholder='Email'
                required
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleAddComment}
          className='btn btn-warning mt-3'
          href='#'
        >
          Gửi nhận xét
        </button>
      </div>

      <div className='rated'>
        {comment.map((item, index) => {
          return (
            <>
              <div key={index} className='media border comment-box p-3 mb-3'>
                <img
                  src='/assets/userac.png'
                  alt=''
                  className='mr-3 mt-1 rounded-circle'
                  style={{ width: '60px' }}
                />
                <div className='media-body'>
                  <h5 style={{ marginBottom: 0 }}>
                    {item.author.name}{' '}
                    <small>
                      <i style={{ fontSize: '.9em', color: '#5b5b5b' }}>
                        <Moment format='DD/MM/YYYY'>{item.createAt}</Moment>
                      </i>
                    </small>
                  </h5>
                  {(() => {
                    let tmp = [];
                    for (let i = 1; i <= item.rating; i++) {
                      tmp.push(<FaStar key={i} color={colors.yellow} />);
                    }

                    for (let i = item.rating; i < 5; i++) {
                      tmp.push(<FaStar key={i} color={colors.grey} />);
                    }

                    return tmp;
                  })()}
                  <p>{item.content}</p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
