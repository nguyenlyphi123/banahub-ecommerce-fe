import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { apiURL } from '../../../../contexts/constants';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

import('./Warehouse.css');

export default function Warehouse() {
  // navigate
  const navigate = useNavigate();

  // get product
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

  // handle search
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // split page and display items
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 20;
  const pagesVisited = pageNumber * itemsPerPage;

  const pageCount = Math.ceil(
    products?.filter((item) => {
      if (!searchTerm) {
        return item;
      } else if (
        item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className='warehouse-container'>
        <div className='warehouse-search mb-3'>
          <input
            onChange={handleSearch}
            className='warehouse-input'
            type=''
            name=''
            value={searchTerm}
            placeholder='Nhập mã sản phẩm'
          />
          <i class='fas fa-search'></i>
        </div>

        <div className='warehouse-item-container'>
          <div className='warehouse-item'>
            <table class='table table-bordered'>
              <thead>
                <tr>
                  <th className='text-center'>STT</th>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>Image</th>
                  <th className='text-center'>Code</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Sold</th>
                  <th className='text-center'>View</th>
                </tr>
              </thead>
              <tbody>
                {products
                  ?.filter((item) => {
                    if (searchTerm === '') {
                      return item;
                    } else if (
                      item._id
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ) {
                      return item;
                    }
                  })
                  .slice(pagesVisited, pagesVisited + itemsPerPage)
                  .map((pro, index) => {
                    return (
                      <tr
                        onClick={() =>
                          navigate(`/employee/warehousing/product/${pro._id}`, {
                            state: { product: pro },
                          })
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        <td className='text-center'>{index + 1}</td>
                        <td className='text-center'>{pro.name}</td>
                        <td className='text-center'>
                          <img
                            style={{ width: '60px' }}
                            src={pro.image}
                            alt=''
                          />
                        </td>
                        <td className='text-center'>{pro._id}</td>
                        <td className='text-center'>{pro.price}</td>
                        <td className='text-center'>
                          {pro.quantity - pro.sold}
                        </td>
                        <td className='text-center'>{pro.sold}</td>
                        <td className='text-center'>{pro.view}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
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
      </div>
    </>
  );
}
