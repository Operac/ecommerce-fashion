import { useContext, useEffect, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { IoArrowForwardCircle } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import Layout from "../Shared/Layout/Layout";
import { ProductContext } from "../Context/ProductContext";
import { FcLike } from "react-icons/fc";

const Home = () => {
  const { HandleGetProducts, productData, HandleAddTCart} = useContext(ProductContext);
  

  // Progressive display for Best Sellers
  const [visibleCount, setVisibleCount] = useState(3);

    // NEW: Track liked products
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  const bestSelling = useMemo(
    () =>
      Array.isArray(productData)
        ? productData.filter((item) => item.bestSelling === true)
        : [],
    [productData]
  );

  useEffect(() => {
  console.log('All products:', productData);
  console.log('Best sellers:', bestSelling);
  console.log('First best seller image:', bestSelling[0]?.image);
}, [productData, bestSelling]);

  // Handlers
  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, bestSelling.length));
  };

  const handleSeeLess = () => {
    setVisibleCount((prev) => Math.max(prev - 3, 3));
  };

  // NEW: Toggle like function
  const handleToggleLike = (productId) => {
    if (likedProducts.includes(productId)) {
      // Remove from liked (unlike)
      setLikedProducts(likedProducts.filter(id => id !== productId));
    } else {
      // Add to liked
      setLikedProducts([...likedProducts, productId]);
    }
  };

  return (
    <Layout>
      <div className="bg-primary flex flex-col justify-center min-h-screen mb-12">

        {/* Hero Section */}
        <div className="flex justify-center">
          <NavLink
            to=""
            className="inline-block rounded-full p-[2px] bg-gradient-to-r from-white to-bg-primary mb-8 text-sm"
          >
            <div className="rounded-full bg-primary p-2 text-white">
              New Rave Collection 2025
            </div>
          </NavLink>
        </div>

        <div className="text-center text-white font-extrabold lg:text-[40px] sm:text-3xl md:text-4xl px-4">
          <h1>
            Where style meets expression, trends <br /> inspire, and fashion thrives
          </h1>
        </div>

        <div className="text-center text-white font-normal mt-4 lg:text-[15px] md:text-[12px] sm:text-[10px] px-4">
          <h2>
            Step into a fashion haven where the latest trends meet your unique style <br /> 
            and every outfit tells a story of confidence and creativity.
          </h2>
        </div>

        <div className="flex justify-between items-center mt-8 pl-6 bg-white rounded-3xl border w-[200px] mx-auto text-center gap-4 text-black hover:scale-105 transition ease-in-out duration-700 cursor-pointer">
          <p>New Collection</p>
          <NavLink to="/newarrivals">
            <IoArrowForwardCircle className="text-4xl" />
          </NavLink>
        </div>

        {/* Swiper Section */}
        <div className="w-full md:px-4 px-8 flex flex-col justify-center items-center mt-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            spaceBetween={20}
            loop
            speed={1000}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full md:h-80 h-80 flex justify-center items-center"
          >
            {productData?.map((product) => (
              <SwiperSlide
                key={product.id}
                className="flex justify-center items-center mt-10 rounded-t-[50%] overflow-hidden"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name || "Fashion"}
                    className="object-cover w-full h-full"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Best Seller Section */}
        <div className="bg-white lg:pt-12 pt-2">
          <p className="text-center text-primary text-2xl font-semibold mt-8">
            Best Sellers
          </p>
          <p className="text-center text-primary mt-2 text-lg">
            Stay cozy and stylish with our exclusive best-selling hoodies
          </p>

          {/* Products */}
          <div className="px-4 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
            {bestSelling.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden bg-white">
                <div className="w-full h-[26rem] overflow-hidden">
                  <Link to={`/product/${item.id}`} className="w-full h-full">
                    <img
                      src={item.image}
                      alt={item.name || "Fashion"}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                </div>
                <div className="p-3">
                  <p className="text-black font-bold mt-2">{item.name}</p>
                  <p className="text-black mt-1">{item.description}</p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="p-2 bg-primary text-white rounded-md">${item.price}</span>
                    <div className="flex gap-4">

                      <span 
    onClick={() => handleToggleLike(item.id)}
    className="rounded-full p-2 bg-white border border-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
  >
    {likedProducts.includes(item.id) ? (
      <FcLike className="h-5 w-5" />
    ) : (
      <FaRegHeart className="h-5 w-5 text-primary" />
    )}
  </span>

                      <span onClick={()=> HandleAddTCart(item, 1, item?.defaultSize, item?.defaultColor )} className="rounded-full p-2 text-white bg-primary flex items-center justify-center cursor-pointer">
                        <FaShoppingCart className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

{/* Dynamic See More / See Less Buttons */}
{bestSelling.length > 3 && (
  <div className="flex justify-center mt-8 gap-4">
    {visibleCount > 3 && (
      <button
        onClick={handleSeeLess}
        className="rounded-md bg-white text-black border-2 border-primary px-6 py-2 cursor-pointer hover:bg-primary hover:text-white transition duration-300"
      >
        See Less
      </button>
    )}
    {visibleCount < bestSelling.length && (
      <button
        onClick={handleSeeMore}
        className="rounded-md bg-white text-black border-2 border-primary px-6 py-2 cursor-pointer hover:bg-primary hover:text-white transition duration-300"
      >
        See More
      </button>
    )}
  </div>
)}
        </div>

      </div>
    </Layout>
  );
};

export default Home;
