import Layout from "../Shared/Layout/Layout";
import { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaFire } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { ProductContext } from "../Context/ProductContext";

const NewArrivals = () => {

  const { HandleGetProducts, productData, HandleAddTCart } = useContext(ProductContext);
  const [likedProducts, setLikedProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newArrival");

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  // Filter and sort new arrivals
  const newArrivals = useMemo(() => {
    if (!Array.isArray(productData)) return [];

    // Filter for new arrivals (you can adjust this logic based on your data)
    // Assuming products have a 'newArrival' property or 'dateAdded'
    let filtered = productData.filter((item) => item.newArrival === true);

    // Filter by category if selected
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Sort products
    if (sortBy === "newArrivals") {
      // Assuming products have a dateAdded or id (higher id = newer)
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    } else if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [productData, selectedCategory, sortBy]);

useEffect(() => {
  console.log("All productData:", productData);
  console.log("productData length:", productData?.length);
  
  // ADD THIS:
  if (productData && productData.length > 0) {
    console.log("FIRST PRODUCT DETAILED:", productData[0]);
    console.log("Does it have newArrival?", productData[0].newArrival);
    console.log("Type of newArrival:", typeof productData[0].newArrival);
    
    // Check all products for newArrival property
    const productsWithNewArrival = productData.filter(p => p.newArrival === true);
    console.log("Products with newArrival === true:", productsWithNewArrival.length);
    
    // Check if any have string "true"
    const productsWithStringTrue = productData.filter(p => p.newArrival === "true");
    console.log("Products with newArrival === 'true' (string):", productsWithStringTrue.length);
    
    // Check all unique newArrival values
      const uniqueNewArrivalValues = [...new Set(productData.map(p => p.newArrival))];
      console.log("All unique newArrival values in your data:", uniqueNewArrivalValues);
    }
  }, [productData]);
  
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
    setVisibleCount((prev) => Math.min(prev + 12, newArrivals.length));
  };

  const handleSeeLess = () => {
    setVisibleCount((prev) => Math.max(prev - 12, 12));
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        
        {/* Hero Section */}
        <div className="relative bg-primary text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-300"></div>
          
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <FaFire className="text-white" />
                Fresh Arrivals
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              New Arrivals 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Discover the latest trends and styles just for you
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm text-white">New This Week</p>
                <p className="text-2xl font-bold">{newArrivals.length}+ Items</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm text-white">Categories</p>
                <p className="text-2xl font-bold">All Styles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-gray-50 border-b sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Category Filter */}
              <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                <span className="font-semibold text-gray-700">Filter:</span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === "all"
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory("men")}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === "men"
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Men
                </button>
                <button
                  onClick={() => setSelectedCategory("woman")}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === "woman"
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Women
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white cursor-pointer font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-lg font-medium">
              {newArrivals.length === 0 ? (
                "No new arrivals found"
              ) : (
                <>
                  Showing {Math.min(visibleCount, newArrivals.length)} of{" "}
                  {newArrivals.length} products
                </>
              )}
            </p>
            
            {/* New Badge */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 text-primary px-4 py-2 rounded-full font-semibold">
              <FaFire />
              Fresh Stock
            </div>
          </div>

          {/* Products Display */}
          {newArrivals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-2xl text-gray-500 mb-4">
                No new arrivals at the moment
              </p>
              <p className="text-gray-400 mb-6">
                Check back soon for the latest fashion trends!
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-300 font-semibold"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {newArrivals.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="group hover:shadow-2xl transition-all ease-in-out duration-500 rounded-lg overflow-hidden bg-white border border-gray-200 relative"
                  >
                    {/* NEW Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                      New
                    </div>

                    <div className="w-full h-80 overflow-hidden bg-gray-100 relative">
                      <Link to={`/product/${item.id}`} className="w-full h-full block">
                        <img
                          src={item.image}
                          alt={item.name || "Fashion"}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>
                      
                      {/* Quick Actions on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleToggleLike(item.id)}
                            className="bg-white p-2 rounded-full hover:scale-110 transition-transform"
                          >
                            {likedProducts.includes(item.id) ? (
                              <FcLike className="h-5 w-5" />
                            ) : (
                              <FaHeart className="h-5 w-5 text-primary" />
                            )}
                          </button>
                          <button onClick={(e)=> {
                          e.preventDefault();
                          HandleAddTCart(item, 1, item?.size, item?.color)}} 
                          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary transition-colors flex items-center gap-2">
                            <FaShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-semibold">Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Tags */}
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {item.category && (
                          <span className="px-2 py-1 bg-gray-100 text-primary rounded text-xs font-medium capitalize">
                            {item.category}
                          </span>
                        )}
                        {item.subcategory && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {item.subcategory}
                          </span>
                        )}
                      </div>

                      <Link to={`/product/${item.id}`}>
                        <p className="text-black font-bold text-lg mt-2 hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </p>
                      </Link>
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-primary">
                          ${item.price}
                        </span>
                        {item.oldPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ${item.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More / See Less Buttons */}
              {newArrivals.length > 12 && (
                <div className="flex justify-center mt-12 gap-4">
                  {visibleCount > 12 && (
                    <button
                      onClick={handleSeeLess}
                      className="rounded-lg bg-white text-black border-2 border-primary px-8 py-3 cursor-pointer hover:bg-primary hover:text-white transition duration-300 font-semibold"
                    >
                      See Less
                    </button>
                  )}
                  {visibleCount < newArrivals.length && (
                    <button
                      onClick={handleSeeMore}
                      className="rounded-lg bg-primary text-white px-8 py-3 cursor-pointer hover:bg-primary transition duration-300 font-semibold shadow-lg"
                    >
                      Load More Products
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-primary text-white py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with New Arrivals
            </h2>
            <p className="text-lg text-primary mb-8">
              Subscribe to our newsletter and be the first to know about new collections!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};
export default NewArrivals;