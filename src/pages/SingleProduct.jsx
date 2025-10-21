import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";import { 
  FaHeart, 
  FaShoppingCart, 
  FaShareAlt, 
  FaStar, 
  FaTruck, 
  FaUndo, 
  FaShieldAlt,
  FaCheck,
  FaMinus,
  FaPlus
} from "react-icons/fa";
import { FcLike } from "react-icons/fc";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

 useEffect(() => {
    if (!productData?.length > 0) {
      HandleGetProducts();
    }
  }, [HandleGetProducts, productData]);


  useEffect(() =>{
    if(productData?.length > 0) {
      const found = productData?.find(
        (item) => parseInt(item?.id) === parseInt(id)
      );
      setProduct(found);
      setSelectedColor(found?.defaultColor || "");
      setSelectedSize(found?.defaultSize || "");
    }
  }, [productData, id]);


  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-primary text-lg animate-pulse">Loading product...</p>
      </div>
    );
  }


  return ( 
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to={`/${product.category}`} className="text-gray-500 hover:text-primary transition-colors capitalize">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side - Image */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {product.tag && (
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold uppercase shadow-lg">
                  {product.tag}
                </div>
              )}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                {liked ? (
                  <FcLike className="w-6 h-6" />
                ) : (
                  <FaHeart className="w-6 h-6 text-primary" />
                )}
              </button>
            </div>

            {/* Thumbnail Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                >
                  <img
                    src={product.image}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 4)
                          ? "text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating || 4.5} ({product.reviews || 128} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-primary text-white shadow-lg scale-105"
                          : "bg-white text-gray-700 border-2 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all
 ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                       style={{ backgroundColor: color }}
                       title={color}
                    >
                      
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="px-4 py-3 bg-white hover:bg-gray-100 transition-colors"
                  >
                    <FaMinus className="text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="px-4 py-3 bg-white hover:bg-gray-100 transition-colors"
                  >
                    <FaPlus className="text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock || 10} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={(e)=>{
                e.preventDefault()
                HandleAddTCart(product, quantity, product?.size, product?.color)
              }} 
              className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                <FaShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-full bg-white text-primary py-4 rounded-lg font-bold text-lg border-2 border-primary hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-3">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <FaTruck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders over $50</p>
              </div>
              <div className="text-center">
                <FaUndo className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
              <div className="text-center">
                <FaShieldAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm font-semibold text-gray-700">Share:</span>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-primary transition-colors">
                <FaShareAlt className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "description"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "details"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "reviews"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Reviews ({product.reviews || 128})
            </button>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Premium quality materials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Comfortable regular fit</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Machine washable</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Product Information</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-semibold capitalize">{product.category}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Subcategory:</dt>
                      <dd className="font-semibold capitalize">{product.subcategory}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Material:</dt>
                      <dd className="font-semibold">100% Cotton</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-gray-600">Care:</dt>
                      <dd className="font-semibold">Machine Wash</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Size Guide</h3>
                  <p className="text-gray-600 mb-3">Measurements in inches</p>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Size</th>
                        <th className="px-3 py-2 text-left">Chest</th>
                        <th className="px-3 py-2 text-left">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-3 py-2">S</td>
                        <td className="px-3 py-2">36"</td>
                        <td className="px-3 py-2">27"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-3 py-2">M</td>
                        <td className="px-3 py-2">40"</td>
                        <td className="px-3 py-2">28"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-3 py-2">L</td>
                        <td className="px-3 py-2">44"</td>
                        <td className="px-3 py-2">29"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl font-bold text-primary">
                        {product.rating || 4.5}
                      </span>
                      <div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating || 4)
                                  ? "text-primary"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">Based on {product.reviews || 128} reviews</p>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary transition-colors">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <FaStar key={j} className="w-4 h-4 text-primary" />
                        ))}
                      </div>
                      <p className="font-semibold mb-1">Great product!</p>
                      <p className="text-gray-600 text-sm mb-2">
                        Really happy with this purchase. The quality is excellent and fits perfectly.
                      </p>
                      <p className="text-gray-400 text-xs">John D. - 2 days ago</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productData?.slice(0, 4).map((item) => (
                <Link 
                  key={item.id} 
                  to={`/product/${item?.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    <div className="flex justify-between items-center ">
                      <p className="text-primary font-bold mt-2">${item.price}</p>
                     <span onClick={()=> HandleAddTCart(item, 1, item?.size, item?.color)} className="rounded-full p-2 text-white bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <FaShoppingCart className="h-5 w-5" />
                          </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    
    </Layout>
  );
}

export default SingleProduct;