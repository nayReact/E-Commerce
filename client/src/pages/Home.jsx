import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  // ── Seller Home ──────────────────────────────────────────────────
  if (user?.role === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-blue-200 font-medium mb-2">Welcome back,</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {user.name} 👋
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Manage your products, track orders and grow your business
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/seller/dashboard"
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                Go to Dashboard
              </Link>
              <Link to="/seller/products/add"
                className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
                + Add Product
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link to="/seller/products"
                className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-md transition text-center">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-bold text-gray-800">My Products</p>
                <p className="text-sm text-gray-500 mt-1">View and manage listings</p>
              </Link>
              <Link to="/seller/orders"
                className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-md transition text-center">
                <p className="text-4xl mb-3">🛒</p>
                <p className="font-bold text-gray-800">My Orders</p>
                <p className="text-sm text-gray-500 mt-1">Track and update orders</p>
              </Link>
              <Link to="/seller/products/add"
                className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-md transition text-center">
                <p className="text-4xl mb-3">➕</p>
                <p className="font-bold text-gray-800">Add Product</p>
                <p className="text-sm text-gray-500 mt-1">List a new product</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Admin Home ───────────────────────────────────────────────────
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-purple-200 font-medium mb-2">Admin Portal</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Welcome, {user.name} 👑
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Monitor platform activity, manage users, orders and categories
            </p>
            <Link to="/admin/dashboard"
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition inline-block">
              Open Admin Panel
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Admin Controls
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/admin/dashboard"
                className="bg-white rounded-2xl shadow p-6 border border-l-4 border-l-purple-500 hover:shadow-md transition">
                <p className="text-3xl mb-2">📊</p>
                <p className="font-bold text-gray-800">Dashboard</p>
                <p className="text-xs text-gray-500 mt-1">Platform overview</p>
              </Link>
              <Link to="/admin/orders"
                className="bg-white rounded-2xl shadow p-6 border border-l-4 border-l-indigo-500 hover:shadow-md transition">
                <p className="text-3xl mb-2">🛒</p>
                <p className="font-bold text-gray-800">All Orders</p>
                <p className="text-xs text-gray-500 mt-1">Manage all orders</p>
              </Link>
              <Link to="/admin/users"
                className="bg-white rounded-2xl shadow p-6 border border-l-4 border-l-green-500 hover:shadow-md transition">
                <p className="text-3xl mb-2">👥</p>
                <p className="font-bold text-gray-800">Users</p>
                <p className="text-xs text-gray-500 mt-1">Manage and approve</p>
              </Link>
              <Link to="/admin/categories"
                className="bg-white rounded-2xl shadow p-6 border border-l-4 border-l-yellow-500 hover:shadow-md transition">
                <p className="text-3xl mb-2">🏷️</p>
                <p className="font-bold text-gray-800">Categories</p>
                <p className="text-xs text-gray-500 mt-1">Add, edit, delete</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Customer Home (logged in) ────────────────────────────────────
  if (user?.role === 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <p className="text-indigo-200 font-medium mb-2">Welcome back,</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {user.name} 🛍️
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Discover premium products curated just for you
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/products"
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition">
                Shop Now
              </Link>
              <Link to="/orders"
                className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
                My Orders
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/products"
                className="bg-white text-center p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-800 mb-1">Free Shipping</h3>
                <p className="text-gray-500 text-sm">On orders above ₹500</p>
              </Link>
              <Link to="/orders"
                className="bg-white text-center p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-semibold text-gray-800 mb-1">Track Orders</h3>
                <p className="text-gray-500 text-sm">Real-time order updates</p>
              </Link>
              <Link to="/profile"
                className="bg-white text-center p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="font-semibold text-gray-800 mb-1">My Profile</h3>
                <p className="text-gray-500 text-sm">Manage addresses & details</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-600 py-14">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to explore new arrivals?
            </h2>
            <p className="text-indigo-200 mb-6">
              Thousands of products from trusted sellers across India
            </p>
            <Link to="/products"
              className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition inline-block">
              Browse Products
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ── Guest Home (not logged in) ───────────────────────────────────
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Elevate Your Shopping Experience
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Discover premium products from trusted sellers across India —
            curated just for you.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link to="/products"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition">
              Shop Now
            </Link>
            <Link to="/register"
              className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders above ₹500</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure and trusted payment methods</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free returns within 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of products from trusted sellers
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/products"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Explore Products
            </Link>
            <Link to="/login"
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;