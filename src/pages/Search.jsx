import Layout from "../Shared/Layout/Layout";
import { useContext, useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { ProductContext } from "../Context/ProductContext";
import { CiSearch } from "react-icons/ci";

const Search = () => {
  const { HandleGetProducts, productData, HandleAddTCart } = useContext(ProductContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [likedProducts, setLikedProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  // Filter based on search query
  const searchResults = useMemo(() => {
    if (!Array.isArray(productData)) return [];

    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return productData.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [productData, query]);

  // Toggle like function
  const handleToggleLike = (productId) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  // Handlers for See More/Less
  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, searchResults.length));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-primary text-white py-12 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center gap-3">
              <CiSearch size={36} className="text-white" />
              Search Results
            </h1>
            <p className="text-base lg:text-lg opacity-90 max-w-2xl">
              {query ? `Showing results for "${query}"` : "Enter a search term to find products."}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Found {searchResults.length} {searchResults.length === 1 ? 'Product' : 'Products'}
            </h2>
          </div>

          {!query.trim() ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
              <CiSearch size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Start Searching</h3>
              <p className="text-gray-500 max-w-md">
                Type something in the search bar above to look for your favorite cloths, collections, and deals.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <CiSearch size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-500 max-w-md">
                We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.
              </p>
              <Link 
                to="/"
                className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {searchResults.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl[0]}
                          alt={item.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <span>No Image Available</span>
                        </div>
                      )}

                      {/* Quick Actions Overlay Spacer */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleLike(item.id);
                          }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-600 hover:text-red-500"
                        >
                          {likedProducts.includes(item.id) ? (
                            <FcLike size={20} />
                          ) : (
                            <FaHeart size={18} className="text-gray-300 hover:text-red-500 transition-colors" />
                          )}
                        </button>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <button 
                          onClick={() => HandleAddTCart(item)}
                          className="w-full py-3 bg-white/90 backdrop-blur-sm text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors shadow-lg"
                        >
                          <FaShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-grow">
                     <Link to={`/product/${item.id}`} className="block mt-auto">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {item.category || "Uncategorized"}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-xl text-primary">
                            ₦{Number(item.price).toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₦{Number(item.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination/Load More */}
              {visibleCount < searchResults.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleSeeMore}
                    className="px-8 py-3 bg-black text-white hover:bg-primary rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Load More Results
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
