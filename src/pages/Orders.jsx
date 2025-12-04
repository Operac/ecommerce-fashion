import React, { useEffect, useState, useContext } from "react";
import Layout from "../Shared/Layout/Layout";
import { Link } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import { baseUrl } from "../Services/userService";
import { FaPrint } from "react-icons/fa";

const Orders = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { User, token } = useContext(ProductContext);

  const fetchReceipts = async () => {
    if (!User?.userid || !token) return;
    
    try {
      const res = await fetch(`${baseUrl}receipts/${User.userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setReceipts(data.data);
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [User, token]);

  const handlePrintReceipt = (receipt) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1>E-Commerce Store</h1>
          <h2>RECEIPT</h2>
          <p>Receipt #${receipt.id} | Date: ${new Date(receipt.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Customer Details:</h3>
          <p>Name: ${receipt.name}<br>
          Email: ${receipt.email}<br>
          Phone: ${receipt.phone}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.receiptItem.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">$${item.price.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 20px;">
          <h3>Total: $${receipt.amount.toFixed(2)}</h3>
          <p>Transaction ID: ${receipt.transactionId}</p>
          <p>Status: ${receipt.status}</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666;">
          <p>Thank you for your business!</p>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl">Loading orders...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>
          
          {receipts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
              </div>
              
              <Link
                to="/"
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{receipt.id}</h3>
                      <p className="text-gray-600">Date: {new Date(receipt.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-600">Transaction: {receipt.transactionId}</p>
                      <p className="text-gray-600">Status: {receipt.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${receipt.amount.toFixed(2)}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handlePrintReceipt(receipt)}
                          className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition"
                        >
                          <FaPrint className="text-xs" />
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Items Ordered:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {receipt.receiptItem.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">IMG</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} • ${item.price.toFixed(2)} each
                            </p>
                            <p className="text-xs text-gray-500">Total: ${item.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
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

export default Orders;