import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import { useDispatch } from 'react-redux';
import { setType } from '../../../../redux/reducers/typeSlice';

import { apiURL } from '../../../../contexts/constants';
import ScrollToTop from '../../../../ScrollToTop';
import './StoreProduct.css';
import '../../stylesheet/Pagination.css';

export default function StoreProduct({}) {
  // redux
  const dispatch = useDispatch();
  const { typeId, ltypeId, handleChangeLTypeId, brandId, handleChangeBrandId } =
    useOutletContext();

  const [productList, setProductList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [lTypeList, setLTypeList] = useState([]);

  const [isNotExist, setIsNotExist] = useState(false);
  const [isLTypeExist, setIsLTypeExist] = useState(false);

  const [pageNumber, setPageNumber] = useState(0);
  const [isFilter, setIsFilter] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // fectch product data
  useEffect(() => {
    if (typeId === null) {
      axios
        .get(`${apiURL}/product/brand/${brandId}`)
        .then((res) => {
          setProductList(res.data.product);
          setPageNumber(0);
          setIsNotExist(false);
        })
        .catch(() => {
          setIsNotExist(true);
          setProductList([]);
        });
    } else if (brandId !== '') {
      axios
        .get(`${apiURL}/product/brand/${brandId}`)
        .then((res) => {
          setProductList(res.data.product);
          setPageNumber(0);
          setIsNotExist(false);
        })
        .catch(() => {
          setIsNotExist(true);
          setProductList([]);
        });
    } else if (typeId && ltypeId === '') {
      axios
        .get(`${apiURL}/product/type/${typeId}`)
        .then((res) => {
          setProductList(res.data.product);
          setPageNumber(0);
          setIsNotExist(false);
        })
        .catch(() => {
          setIsNotExist(true);
          setProductList([]);
        });
    } else if (ltypeId !== '') {
      axios
        .get(`${apiURL}/product/ltype/${ltypeId}`)
        .then((res) => {
          setProductList(res.data.product);
          setPageNumber(0);
          setIsNotExist(false);
        })
        .catch(() => {
          setIsNotExist(true);
          setProductList([]);
        });
    } else {
      axios.get(`${apiURL}/product`).then((res) => {
        setProductList(res.data.products);
        setPageNumber(0);
        setIsNotExist(false);
      });
    }
  }, [typeId, ltypeId, brandId]);

  // fetch ltype data
  useEffect(() => {
    if (!typeId) {
      setLTypeList([]);
    } else {
      axios
        .get(`${apiURL}/ltype/h/${typeId}`)
        .then((res) => {
          setLTypeList(res.data.ltype);
          setIsLTypeExist(true);
        })
        .catch((err) => {
          console.log(err);
          setIsLTypeExist(false);
        });
    }
  }, [typeId]);

  // fetch brand data
  useEffect(() => {
    if (!isLTypeExist && typeId !== '') {
      axios
        .get(`${apiURL}/brand/type/${typeId}`)
        .then((res) => setBrandList(res.data.brand))
        .catch((err) => console.log(err));
    } else if (isLTypeExist && ltypeId !== '') {
      axios
        .get(`${apiURL}/brand/ltype/${ltypeId}`)
        .then((res) => setBrandList(res.data.brand))
        .catch((err) => console.log(err));
    } else {
      setBrandList([]);
    }
  }, [typeId, ltypeId, isLTypeExist === false]);

  //
  useEffect(() => {
    setIsFilter(false);
  }, [typeId]);

  // crop product name
  const truncate = (e) => {
    return e.length > 65 ? e.substring(0, 45) + '...' : e;
  };

  const formatter = new Intl.NumberFormat('en');

  // product quatity = 0
  const SoldOut = (item, index) => {
    return (
      <div className='col-md-3 mb-4'>
        <Link
          key={index}
          to={'/store/product' + item._id}
          className='item-link d-flex justify-content-center'
        >
          <div className='card product-card'>
            <div className='soldout'>
              <p>sold out</p>
            </div>
            <img className='card-img-top' src={item.image} alt='' />
            <div className='card-body'>
              <p
                className='card-title text-uppercase'
                style={{ fontSize: '0.75em', fontWeight: 500 }}
              >
                {truncate(item.name)}
              </p>
              <p className='card-text' style={{ color: '#be9329' }}>
                {formatter.format(item.price)} VNĐ
              </p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  // product quantity > 0
  const ReStock = (item, index) => {
    return (
      <div className='col-md-3 mb-2 pl-1 pr-1'>
        <div className='card-container'>
          <Link
            onClick={() => dispatch(setType(item.type))}
            key={index}
            to={'/store/product/' + item._id}
            state={{ product: item }}
            className='item-link d-flex justify-content-center'
          >
            <div className='card border-0 product-card'>
              <img className='card-img-top' src={item.image} alt='' />
              <div className='card-body'>
                <p
                  className='card-title text-uppercase'
                  style={{ fontSize: '0.75em', fontWeight: 500 }}
                >
                  {truncate(item.name)}
                </p>

                <p className='card-sold m-0'>Đã bán {item.sold}</p>

                <p className='card-text' style={{ color: '#be9329' }}>
                  {formatter.format(item.price)} VNĐ
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  // dont have any product
  const NotExist = () => {
    return (
      <>
        <div className='container-fluid'>
          <div className='d-flex justify-content-center'>
            <p className='not-exist'>Không tìm thấy sản phẩm</p>
          </div>
        </div>
      </>
    );
  };

  // split page and display items
  const itemsPerPage = 20;
  const pagesVisited = pageNumber * itemsPerPage;

  const displayItems = productList
    ?.filter((item) => {
      if (searchTerm === '') {
        return item;
      } else if (item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())) {
        return item;
      }
    })
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((item, index) => {
      return (
        <>
          {item.quantity - item.sold === 0
            ? SoldOut(item, index)
            : ReStock(item, index)}
        </>
      );
    });

  const pageCount = Math.ceil(
    productList?.filter((item) => {
      if (!searchTerm) {
        return item;
      } else if (
        // item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
        item.name.includes(searchTerm)
      ) {
        return item;
      }
    }).length / itemsPerPage,
  );

  // smooth page scroll
  const changePage = ({ selected }) => {
    window.scroll({ top: 0, behavior: 'smooth' });
    setPageNumber(selected);
  };

  return (
    <>
      <div className='col-12 pl-1 pr-2 mb-1 mt-4'>
        <div className='filter-container d-flex justify-content-between'>
          <div className='brand-container row mt-1 ml-0 mr-0'>
            {typeId !== null
              ? isLTypeExist && ltypeId === ''
                ? lTypeList?.map((item, index) => {
                    return (
                      <div
                        onClick={() => handleChangeLTypeId(item._id)}
                        key={index}
                        className='brand-box mr-2'
                      >
                        <p className='brand-context'>{item.name}</p>
                      </div>
                    );
                  })
                : brandList?.map((item, index) => {
                    return (
                      <div
                        onClick={() => handleChangeBrandId(item._id)}
                        key={index}
                        className='brand-box'
                      >
                        <div className='brand-context'>{item.name}</div>
                      </div>
                    );
                  })
              : ''}
          </div>
        </div>
      </div>
      {!isNotExist ? (
        <>
          <ScrollToTop />
          {displayItems}
          <ReactPaginate
            previousLabel={'<<'}
            nextLabel={'>>'}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={'paginationBtn'}
            previousLinkClassName={'previousBtn'}
            nextLinkClassName={'nextBtn'}
            disabledClassName={'paginationDisabled'}
            activeClassName={'paginationActive'}
          />
        </>
      ) : (
        <NotExist />
      )}
    </>
  );
}
