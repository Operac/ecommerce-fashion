import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { FaCheckCircle, FaDownload, FaPrint, FaShare, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { ProductContext } from "../Context/ProductContext";
import { baseUrl } from "../Services/userService";
import { generateInvoicePDF } from "../utils/invoiceGenerator";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const { User, token } = useContext(ProductContext);

  const fetchReceipt = async () => {
    const receiptId = localStorage.getItem("lastReceiptId");
    if (receiptId && token) {
      try {
        const res = await fetch(`${baseUrl}receipt/${receiptId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setReceipt(data.data);
          const items = data.data.receiptItems.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.unitPrice,
            image: item.product.image,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          }));
          setOrderItems(items);
          setOrderTotal(data.data.totalAmount);
        }
      } catch (error) {
        console.error("Error fetching receipt:", error);
      }
    }
  };

  useEffect(() => {
    // Try to fetch receipt first, fallback to localStorage
    fetchReceipt();
    
    // Fallback to localStorage if no receipt found
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder && !receipt) {
      const order = JSON.parse(savedOrder);
      setOrderItems(order.items || []);
      setOrderTotal(order.total || 0);
    }
  }, [token]);

  const handleDownloadInvoice = () => {
    if (receipt) {
      generateInvoicePDF(receipt, User);
    }
  };

  const reference = searchParams.get("reference");
  const status = searchParams.get("status");
  const orderDate = new Date();
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header / Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thank You! Your Order is Confirmed.
            </h1>
            <p className="text-gray-600 mb-4">
              We've received your payment and are processing your order.
            </p>
            {reference && (
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Order Reference</p>
                <p className="text-lg font-bold text-gray-800">{reference}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {orderItems.length > 0 && (
                <div className="space-y-4 mb-6">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Paid:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Payment Method: Credit Card</p>
                <p className="text-sm text-gray-600">Order Date: {orderDate.toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Estimated Delivery: {deliveryDate.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer Details & Actions */}
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <span>{User?.email || 'customer@email.com'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <span>{User?.phone || '+1 (555) 123-4567'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">Shipping Address:</p>
                      <p>{User?.address || '123 Main St, City, State 12345'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps / CTA */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                    Track Order
                  </button>
                  <Link
                    to="/"
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition text-center block"
                  >
                    Continue Shopping
                  </Link>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownloadInvoice}
                      disabled={!receipt}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      <FaDownload className="text-sm" />
                      <span className="text-sm">Invoice</span>
                    </button>
                    <button 
                      onClick={handleDownloadInvoice}
                      disabled={!receipt}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      <FaPrint className="text-sm" />
                      <span className="text-sm">Print</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition">
                      <FaShare className="text-sm" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <Link to="/contact" className="block text-blue-600 hover:underline">
                    Contact Customer Support
                  </Link>
                  <Link to="/faq" className="block text-blue-600 hover:underline">
                    Delivery & Returns FAQ
                  </Link>
                  <button className="text-blue-600 hover:underline">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Info */}
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div className="text-center">
                <div className="text-2xl mb-2">📧</div>
                <p className="font-medium">Confirmation Email</p>
                <p>You'll receive an order confirmation within 5 minutes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <p className="font-medium">Processing</p>
                <p>Your order will be processed within 1-2 business days</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚚</div>
                <p className="font-medium">Shipping</p>
                <p>Estimated delivery in 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;