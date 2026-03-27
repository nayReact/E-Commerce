import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

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
import AdminUsers from './pages/admin/AdminUsers';

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

              <Route path='/cart' element={<ProtectedRoute roles={['customer', 'seller', 'admin']}>
                <Cart />
              </ProtectedRoute>} />
              <Route path='/checkout' element={<ProtectedRoute roles={['customer', 'seller', 'admin']}>
                < Checkout />
              </ProtectedRoute> } />
              <Route path='/orders' element={ <ProtectedRoute roles={['customer', 'seller', 'admin']}>
                < Orders/>
              </ProtectedRoute> } />
              <Route path='/orders/:id' element={<ProtectedRoute roles={['customer', 'seller', 'admin']}>
                < OrderDetail/>
              </ProtectedRoute> } />

              <Route path='/seller/dashboard' element={ <ProtectedRoute roles={['seller', 'admin']}>
                < SellerDashboard/>
              </ProtectedRoute> } />
              <Route path='/seller/products/add' element= {<ProtectedRoute roles={['seller', 'admin']}> 
                < AddProduct/>
              </ProtectedRoute>}/>
              <Route path='/seller/products/edit/:id' element={<ProtectedRoute roles={['seller', 'admin']}>
                < EditProduct/>
                </ProtectedRoute>} />
              <Route path='/seller/products' element={<ProtectedRoute roles={['seller', 'admin']}>
                 < SellerProducts/>
                 </ProtectedRoute>}/>
              <Route path='/seller/orders' element={<ProtectedRoute roles={['seller', 'admin']}>
                < SellerOrders/>
              </ProtectedRoute>} />

              <Route path='/admin/dashboard' element={<ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>} />
              <Route path='/admin/orders' element={<ProtectedRoute roles={['admin']}>
                < AdminOrders/>
              </ProtectedRoute>} />
              <Route path='/admin/categories' element={<ProtectedRoute roles={['admin']}>
                <AdminCategories/>
              </ProtectedRoute>} />
              <Route path='/admin/users' element={<ProtectedRoute roles={['admin']}>
                < AdminUsers/>
              </ProtectedRoute>} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;