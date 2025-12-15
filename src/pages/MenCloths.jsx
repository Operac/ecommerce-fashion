import { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Layout from "../Shared/Layout/Layout";
import { ProductContext } from "../Context/ProductContext";
import { baseUrl } from "../Services/userService";

const MenCloths = () => {
  const { HandleGetProducts, productData, HandleAddTCart, likedProducts, handleToggleLike } = useContext(ProductContext);
  const [visibleCount, setVisibleCount] = useState(9);
  
  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [dbSubcategories, setDbSubcategories] = useState([]);
  const [dbTags, setDbTags] = useState([]);

  useEffect(() => {
    // Fetch Subcategories
    fetch(`${baseUrl}subcategory/getAll`)
        .then(res => res.json())
        .then(data => {
            if(data.success) setDbSubcategories(data.data || []);
        })
        .catch(err => console.error("Error fetching subcategories", err));
    
    // Fetch Tags
    fetch(`${baseUrl}tag/getAll`)
        .then(res => res.json())
        .then(data => {
            if(data.success) setDbTags(data.data || []);
        })
        .catch(err => console.error("Error fetching tags", err));
  }, []);

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  // Filter products for men category with subcategory and tag filters
  const menProducts = useMemo(() => {
    if (!Array.isArray(productData)) return [];

    let filtered = productData.filter((item) => 
      item.category?.toLowerCase() === "men" || 
      item.category?.toLowerCase() === "male" ||
      item.category?.toLowerCase() === "man"
    );

    // Filter by subcategory
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((item) => 
        item.subcategory?.toLowerCase().includes(selectedSubcategory.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter((item) => 
        item.tags?.includes(selectedTag) || item.tag === selectedTag
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [productData, selectedSubcategory, selectedTag, searchTerm]);



  // Handlers for See More/Less
  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 9, menProducts.length));
  };

  const handleSeeLess = () => {
    setVisibleCount((prev) => Math.max(prev - 9, 9));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedSubcategory("all");
    setSelectedTag("all");
    setSearchTerm("");
    setVisibleCount(9);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-primary text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Men's Collection
            </h1>
            <p className="text-lg md:text-xl">
              Discover the latest trends in men's fashion
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subcategory Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {dbSubcategories
                    .filter(sub => {
                        // Include if category matches or no category filter logic
                        // Only show subcategories relevant to "Men" (or variations) or if they have no category specific logic in the schema for now they do.
                        const catName = sub.category?.name?.toLowerCase();
                        return catName === 'men' || catName === 'male';
                    })
                    .map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                  {/* Fallback hardcoded if DB empty? No, better to rely on DB */}
                </select>
              </div>

              {/* Tag Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Style
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white cursor-pointer"
                >
                  <option value="all">All Styles</option>
                  {dbTags.map(tag => (
                      <option key={tag.id} value={tag.name}>{tag.name}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-white hover:text-primary border-2 border-primary transition-colors duration-300 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedSubcategory !== "all" || selectedTag !== "all" || searchTerm) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedSubcategory !== "all" && (
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                    {selectedSubcategory}
                  </span>
                )}
                {selectedTag !== "all" && (
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                    {selectedTag}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                    "{searchTerm}"
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Count */}
          <div className="my-8">
            <p className="text-gray-600 text-lg font-medium">
              {menProducts.length === 0 ? (
                "No products found"
              ) : (
                <>
                  Showing {Math.min(visibleCount, menProducts.length)} of{" "}
                  {menProducts.length} products
                </>
              )}
            </p>
          </div>

          {/* Products Display */}
          {menProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">
                No products match your filters
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-white hover:text-primary border-2 border-primary transition-colors duration-300 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {menProducts.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="hover:shadow-2xl transition ease-in-out duration-500 rounded-lg overflow-hidden bg-white border border-gray-200"
                  >
                    <div className="w-full h-[26rem] overflow-hidden bg-gray-100">
                      <Link to={`/product/${item.id}`} className="w-full h-full">
                        <img
                          src={item.image}
                          alt={item.name || "Men's Fashion"}
                          className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                    </div>
                    <div className="p-4">
                      {/* Tags */}
                      <div className="flex gap-2 mb-2">
                        {item.subcategory && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                            {item.subcategory}
                          </span>
                        )}
                        {item.tag && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-black font-bold text-lg mt-2">
                        {item.name}
                      </p>
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex flex-col">
                          {item.discount > 0 && item.oldPrice ? (
                             <div className="flex items-center gap-2">
                                <span className="text-gray-400 line-through text-sm">
                                  ${item.oldPrice}
                                </span>
                                <span className="text-xs font-bold text-red-500 bg-red-100 px-1 rounded">
                                  -{item.discount}%
                                </span>
                             </div>
                          ) : null}
                          <span className="px-3 py-2 bg-primary text-white rounded-md font-bold text-lg w-fit">
                            ${item.price}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <span
                            onClick={() => handleToggleLike(item.id)}
                            className="rounded-full p-2 bg-white border border-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          >
                            {likedProducts.includes(item.id) ? (
                              <FcLike className="h-5 w-5" />
                            ) : (
                              <FaHeart className="h-5 w-5 text-primary" />
                            )}
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

              {/* See More / See Less Buttons */}
              {menProducts.length > 9 && (
                <div className="flex justify-center mt-12 gap-4">
                  {visibleCount > 9 && (
                    <button
                      onClick={handleSeeLess}
                      className="rounded-md bg-white text-black border-2 border-primary px-8 py-3 cursor-pointer hover:bg-primary hover:text-white transition duration-300 font-semibold"
                    >
                      See Less
                    </button>
                  )}
                  {visibleCount < menProducts.length && (
                    <button
                      onClick={handleSeeMore}
                      className="rounded-md bg-white text-black border-2 border-primary px-8 py-3 cursor-pointer hover:bg-primary hover:text-white transition duration-300 font-semibold"
                    >
                      See More
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MenCloths;