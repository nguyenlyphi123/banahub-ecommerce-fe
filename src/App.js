import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AuthContextProvider from './contexts/AuthContext';
import { PrivateRoute } from './private/PrivateRoute';
import { EmployeePrivateRoute } from './private/PrivateRoute';

import Customer from './components/user/Index';
import Employee from './components/employee/Index';
import Admin from './components/admin/Index';
import HomePage from './components/user/homePage/Index';
import StorePage from './components/user/storePage/Index';
import ProductPage from './components/user/productPage/Index';
import CartPage from './components/user/cartPage/Index';
import PaymentPage from './components/user/paymentPage/Index';
import LoginPage from './components/user/authenticate/login/LoginPage';
import RegisterPage from './components/user/authenticate/register/RegisterPage';
import InvoicePage from './components/user/invoicePage/Index';
import BlankPage from './components/blankpage/BlankPage';

import StoreProduct from './components/user/storePage/product/StoreProduct';

import InvoiceRequirement from './components/employee/invoice-requirement/Index';
import WorkingSchedule from './components/employee/working-schedule/Index';
import Warehousing from './components/employee/warehousing/Index';
import Promotion from './components/employee/promotion/Index';
import Engineering from './components/employee/engineering/Index';
import Revenue from './components/employee/revenue/Index';
import Home from './components/employee/home/Home';
import Warranty from './components/employee/warranty/Index';

import Working from './components/employee/working-schedule/working/Working';
import Scheduling from './components/employee/working-schedule/scheduling/Scheduling';
import Processing from './components/employee/invoice-requirement/processing/Processing';
import Complete from './components/employee/invoice-requirement/complete/Complete';
import Processed from './components/employee/invoice-requirement/processed/Processed';
import Prepare from './components/employee/invoice-requirement/prepare-invoice/Prepare';
import EmployeeLoginPage from './components/employee/authenticate/LoginPage';
import PromotionCreate from './components/employee/promotion/create-promotion/PromotionCreate';
import PromotionUpdate from './components/employee/promotion/update-promotion/PromotionUpdate';
import WarehouseRequirement from './components/employee/warehousing/requirement/WarehouseRequirement';
import Exporting from './components/employee/warehousing/export-warehouse/Exporting';
import Importing from './components/employee/warehousing/import-warehouse/Importing';
import Warehouse from './components/employee/warehousing/warehouse/Warehouse';
import Receiving from './components/employee/warranty/receive/Receiving';
import Checking from './components/employee/warranty/checking/Checking';
import Transfering from './components/employee/warranty/transfering/Transfering';
import Transfered from './components/employee/warranty/transfered/Transfered';
import CompleteWarranty from './components/employee/warranty/complete/CompleteWarranty';

import ProductDetail from './components/employee/warehousing/product-detail/ProductDetail';
import Creating from './components/employee/warehousing/import-warehouse/creating/Creating';
import Choosing from './components/employee/warehousing/import-warehouse/choosing/Choosing';
import ExportList from './components/employee/warehousing/export-warehouse/export-list/ExportList';
import ExportDetail from './components/employee/warehousing/export-warehouse/export-detail/ExportDetail';

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Customer />}>
          <Route index element={<HomePage />} />
          <Route path='store' element={<StorePage />}>
            <Route path=':typeId' element={<StoreProduct />} />
            <Route path='product/:productId' element={<ProductPage />} />
          </Route>
          <Route path='cart' element={<CartPage />} />
          <Route element={<PrivateRoute />}>
            <Route path='invoice' element={<InvoicePage />} />
            <Route path='payment' element={<PaymentPage />} />
          </Route>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Route>

        <Route element={<EmployeePrivateRoute />}>
          <Route path='/employee' element={<Employee />}>
            <Route index element={<Home />} />
            <Route path='invoices/*' element={<InvoiceRequirement />}>
              <Route index element={<Processing />} />
              <Route path='processed' element={<Processed />} />
              <Route path='complete' element={<Complete />} />
              <Route path='prepare' element={<Prepare />} />
            </Route>
            <Route path='working-schedule' element={<WorkingSchedule />}>
              <Route index element={<Working />} />
              <Route path='scheduling' element={<Scheduling />} />
            </Route>
            <Route path='warehousing' element={<Warehousing />}>
              <Route index element={<WarehouseRequirement />} />
              <Route path='export' element={<Exporting />}>
                <Route index element={<ExportList />} />
                <Route path=':productId' element={<ExportDetail />} />
              </Route>
              <Route path='import' element={<Importing />}>
                <Route index element={<Choosing />} />
                <Route path='create' element={<Creating />} />
              </Route>
              <Route path='warehouse' element={<Warehouse />} />
            </Route>
            <Route
              path='warehousing/product/:productId'
              element={<ProductDetail />}
            />
            <Route path='promotion' element={<Promotion />} />
            <Route path='promotion/create' element={<PromotionCreate />} />
            <Route path='promotion/update' element={<PromotionUpdate />} />
            <Route path='engineering' element={<Engineering />} />
            <Route path='revenue' element={<Revenue />} />
            <Route path='warranty' element={<Warranty />}>
              <Route index element={<Receiving />} />
              <Route path='checking' element={<Checking />} />
              <Route path='transfering' element={<Transfering />} />
              <Route path='transfered' element={<Transfered />} />
              <Route path='complete' element={<CompleteWarranty />} />
            </Route>
          </Route>
        </Route>

        <Route path='login/employee' element={<EmployeeLoginPage />} />
        <Route path='/admin' element={<Admin />}></Route>

        <Route path='*' element={<BlankPage />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
