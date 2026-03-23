import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetails';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerOrders from './pages/seller/SellerOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/products' element={<ProductList />} />
              <Route path='/products/:id' element={< ProductDetails/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/checkout' element={< Checkout />} />
              <Route path='/orders' element={< Orders/>} />
              <Route path='/orders/:id' element={< OrderDetail/>} />
              <Route path='/seller/dashboard' element={< SellerDashboard/>} />
              
              <Route path='/seller/products/add' element= {< AddProduct/>}/>
              <Route path='/seller/products/edit/:id' element={< EditProduct/>} />
              <Route path='/seller/products' element={< SellerProducts/>}/>
              <Route path='/seller/orders' element={< SellerOrders/>} />

              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/orders' element={< AdminOrders/>} />
              <Route path='/admin/categories' element={<AdminCategories/>} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;