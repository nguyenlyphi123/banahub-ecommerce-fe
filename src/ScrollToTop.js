import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ dataFetchSuccess }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      dataFetchSuccess ||
      !dataFetchSuccess ||
      dataFetchSuccess === undefined ||
      dataFetchSuccess === null
    ) {
      window && window.scrollTo(0, 0);
    }
  }, [pathname, dataFetchSuccess]);

  return null;
};

export default ScrollToTop;
