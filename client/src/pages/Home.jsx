import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-28 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
             Elevate Your Shopping Experience
            </h1>

          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Discover premium products from trusted sellers across India — curated just for you.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              to="/products"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition transform"
            >
              Shop Now
            </Link>

            <Link
              to="/register"
              className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
    </section>


      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders above ₹500</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure and trusted payment methods</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free returns within 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-600 mb-8">Browse thousands of products from trusted sellers</p>
          <Link
            to="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;