import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import axios from 'axios';
import { apiURL } from '../../../../contexts/constants';
import moment from 'moment';
import { Chart, ArcElement } from 'chart.js/auto';
import { PolarArea } from 'react-chartjs-2';

Chart.register(ArcElement);

export default function BestWeeklySellingProductPolarChart() {
  // get day of week
  // calendar
  const [calendar, setCalendar] = useState([]);
  const [dat, setDat] = useState(moment().subtract(1, 'week'));

  var weekStart = dat.clone().startOf('week');
  var weekEnd = dat.clone().endOf('week');

  useEffect(() => {
    const weekDays = [];
    let day = weekStart.clone();
    while (day.isSameOrBefore(weekEnd)) {
      weekDays.push(day.clone());
      day.add(1, 'day');
    }

    const parsedData = weekDays.map((day) => day.format('DD/MM/YYYY'));

    setCalendar(parsedData);
  }, [dat]);

  // Setup data
  const [product, setProduct] = useState([]);

  const labels = product?.map((item, index) =>
    item.product.name.length > 35
      ? item.product.name.substring(0, 30) + '...'
      : item.product.name,
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Weekly sold',
        data: product?.map((item) => item.quantity),
        backgroundColor: [
          '#F9C5D1',
          '#E6E6FA',
          '#87CEEB',
          '#98FF98',
          '#FFE5B4',
          '#FFF8DC',
          '#C8A2C8',
          '#AFEEEE',
          '#F08080',
          '#B0E0E6',
          '#FFFACD',
          '#FFDAB9',
        ],
        borderColor: [
          '#F9C5D1',
          '#E6E6FA',
          '#87CEEB',
          '#98FF98',
          '#FFE5B4',
          '#FFF8DC',
          '#C8A2C8',
          '#AFEEEE',
          '#F08080',
          '#B0E0E6',
          '#FFFACD',
          '#FFDAB9',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function (value, index, values) {
              // custom tickFormat function to render images as labels
              return '<img src="' + value + '" height="50">';
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    const billFetch = () => {
      axios
        .get(`${apiURL}/bill`)
        .then((res) => {
          res.data.bills
            .filter(
              (bill) =>
                moment(bill.createAt).format('DD/MM/YYYY') >=
                  moment(weekStart).format('DD/MM/YYYY') &&
                moment(bill.createAt).format('DD/MM/YYYY') <=
                  moment(weekEnd).format('DD/MM/YYYY'),
            )
            .forEach((bill) => {
              bill.cart_list.forEach((cart) => {
                const productIndex = product.findIndex(
                  (pro) => pro.product._id === cart.product._id,
                );

                if (productIndex === -1) {
                  product.push({
                    product: cart.product,
                    quantity: cart.quantity,
                  });
                } else {
                  const updatedProduct = [...product];
                  updatedProduct[productIndex].quantity += cart.quantity;
                  setProduct(updatedProduct);
                }
              });
            });
        })
        .catch((err) => console.log(err));
    };

    billFetch();
  }, [calendar, dat]);

  // crop product name
  const truncate = (e) => {
    return e.length > 55 ? e.substring(0, 40) + '...' : e;
  };

  return <PolarArea data={data} />;
}
