import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Layout from "../Shared/Layout/Layout";
import { ProductContext } from "../Context/ProductContext";

const LikedProducts = () => {
  const { productData, likedProducts, handleToggleLike, HandleAddTCart } = useContext(ProductContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(productData) && Array.isArray(likedProducts)) {
      const filtered = productData.filter((item) => likedProducts.includes(item.id));
      setWishlistItems(filtered);
    }
  }, [productData, likedProducts]);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-primary text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My Wishlist
            </h1>
            <p className="text-lg md:text-xl">
              Your favorite items saved in one place
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-8">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">
                Your wishlist is empty
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-white hover:text-primary border-2 border-primary transition-colors duration-300 font-semibold"
              >
                Go Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="hover:shadow-2xl transition ease-in-out duration-500 rounded-lg overflow-hidden bg-white border border-gray-200"
                >
                  <div className="w-full h-[26rem] overflow-hidden bg-gray-100">
                    <Link to={`/product/${item.id}`} className="w-full h-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                  <div className="p-4">
                    <p className="text-black font-bold text-lg mt-2">
                      {item.name}
                    </p>
                    <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="px-3 py-2 bg-primary text-white rounded-md font-bold text-lg">
                        ${item.price}
                      </span>
                      <div className="flex gap-3">
                        <span
                          onClick={() => handleToggleLike(item.id)}
                          className="rounded-full p-2 bg-white border border-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                        >
                          <FcLike className="h-5 w-5" />
                        </span>
                        <span onClick={()=> HandleAddTCart(item, 1, item?.size, item?.color)} className="rounded-full p-2 text-white bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                          <FaShoppingCart className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LikedProducts;
