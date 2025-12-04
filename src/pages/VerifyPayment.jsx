// import { useContext, useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { baseUrl } from "../Services/userService";
// import { PulseLoader } from "react-spinners";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import { MdError } from "react-icons/md";
// import { ProductContext } from "../Context/ProductContext";
// import { toast } from "react-toastify";

// const VerifyPayment = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [isVerifying, setIsVerifying] = useState(true);
//   const [isVerified, setIsVerified] = useState(false);
//   const [receiptData, setReceiptData] = useState(null);
//   const [error, setError] = useState(null);
//   const { token, clearCart, User } = useContext(ProductContext);

//   const transaction_id = searchParams.get("transaction_id");
//   const status = searchParams.get("status");
//   const tx_ref = searchParams.get("tx_ref");

//   useEffect(() => {
//     const verifyPayment = async () => {
//       // Check if payment was cancelled
//       if (status === "cancelled") {
//         toast.error("Payment was cancelled");
//         navigate("/cart");
//         return;
//       }

//       // Check if we have transaction_id
//       if (!transaction_id) {
//         toast.error("No transaction ID found");
//         navigate("/cart");
//         return;
//       }

//       try {
//         setIsVerifying(true);

//         // Call backend to verify payment
//         const response = await fetch(
//           `${baseUrl}verifypayment?transaction_id=${transaction_id}`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await response.json();

//         if (response.ok && data.success) {
//           setIsVerified(true);
//           setReceiptData(data.data);
          
//           // Clear cart in frontend context
//           clearCart();
          
//           toast.success("Payment verified successfully!");

//           // Redirect to orders page after 2 seconds
//           setTimeout(() => {
//             navigate("/orders");
//           }, 2000);
//         } else {
//           setError(data.message || "Payment verification failed");
//           toast.error(data.message || "Payment verification failed");
          
//           // Redirect to cart after 3 seconds
//           setTimeout(() => {
//             navigate("/cart");
//           }, 3000);
//         }
//       } catch (error) {
//         console.error("Verification error:", error);
//         setError("An error occurred during verification");
//         toast.error("Payment verification failed");
        
//         // Redirect to cart after 3 seconds
//         setTimeout(() => {
//           navigate("/cart");
//         }, 3000);
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifyPayment();
//   }, [transaction_id, status, token, navigate, clearCart]);

//   return (
//     <div className="relative min-h-screen">
//       {isVerifying && (
//         <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center z-20 bg-white">
//           <PulseLoader color="#000" />
//           <p className="text-2xl font-semibold mt-4">Verifying Payment...</p>
//           <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
//         </div>
//       )}

//       {!isVerifying && isVerified && (
//         <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//           <FaRegCircleCheck className="text-green-500 text-6xl" />
//           <p className="text-2xl font-semibold">Payment Successful!</p>
//           <p className="text-gray-600">Your order has been confirmed</p>
//           {receiptData && (
//             <div className="mt-4 text-center">
//               <p className="text-sm text-gray-500">Order ID: {receiptData.orderId}</p>
//               <p className="text-sm text-gray-500">Amount: ₦{receiptData.amount.toFixed(2)}</p>
//             </div>
//           )}
//           <p className="text-gray-600 mt-4">Redirecting to your orders...</p>
//         </div>
//       )}

//       {!isVerifying && !isVerified && error && (
//         <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//           <MdError className="text-red-500 text-6xl" />
//           <p className="text-2xl font-semibold">Payment Verification Failed</p>
//           <p className="text-gray-600">{error}</p>
//           <p className="text-gray-600 mt-4">Redirecting back to cart...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyPayment;

import { useContext, useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../Services/userService";
import { PulseLoader } from "react-spinners";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { ProductContext } from "../Context/ProductContext";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState(null);
  const { token, clearCart, clearCartFromDatabase, fetchUserCart } = useContext(ProductContext);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const hasVerifiedRef = useRef(false); // Prevent double verification

  const transaction_id = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  useEffect(() => {
    // Set mounted status
    isMountedRef.current = true;

    const verifyPayment = async () => {
      // Prevent double verification
      if (hasVerifiedRef.current) {
        console.log("Payment already verified, skipping...");
        return;
      }

      // Check if payment was cancelled
      if (status === "cancelled") {
        console.log("Payment cancelled by user");
        toast.error("Payment was cancelled");
        navigate("/cart");
        return;
      }

      // Check if we have transaction_id
      if (!transaction_id) {
        console.error("No transaction ID found in URL params");
        toast.error("No transaction ID found");
        navigate("/cart");
        return;
      }

      // Get fresh token from storage
      const currentToken = token || 
        localStorage.getItem('token') || 
        sessionStorage.getItem('token');

      // Check if token exists
      if (!currentToken) {
        console.error("No authentication token found");
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      // Mark as verifying
      hasVerifiedRef.current = true;

      try {
        setIsVerifying(true);
        console.log("=== STARTING PAYMENT VERIFICATION ===");
        console.log("Transaction ID:", transaction_id);
        console.log("Status from URL:", status);

        // Call backend to verify payment
        const response = await fetch(
          `${baseUrl}verifypayment?transaction_id=${transaction_id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Verification response data:", data);

        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        // Handle successful verification
        if (response.ok && data.success) {
          console.log("✓ Payment verified successfully");
          setIsVerified(true);
          setReceiptData(data.data);
          
          // Clear cart from database and locally
          console.log("Clearing cart...");
          await clearCartFromDatabase();
          clearCart();
          
          toast.success("Payment verified successfully!");

          // Redirect to order history page after 2 seconds
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              console.log("Redirecting to order history page...");
              navigate("/order-history");
            }
          }, 2000);
        } else {
          // Handle failed verification or server error
          const errorMessage = data.message || data.error || "Payment verification failed";
          console.error("✗ Verification failed - Status:", response.status);
          console.error("Error message:", errorMessage);
          console.error("Full response:", data);
          
          setError(errorMessage);
          toast.error(errorMessage);
          
          // Redirect to cart after 3 seconds
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              navigate("/cart");
            }
          }, 3000);
        }
      } catch (error) {
        console.error("=== VERIFICATION ERROR ===");
        console.error("Error caught:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error object:", error);
        
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;
        
        const errorMessage = error.message || "An error occurred during verification";
        setError(errorMessage);
        toast.error("Payment verification failed - Please contact support");
        
        // Redirect to cart after 3 seconds
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            navigate("/cart");
          }
        }, 3000);
      } finally {
        if (isMountedRef.current) {
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [transaction_id, status, token, navigate, clearCart, fetchUserCart]);

  return (
    <div className="relative min-h-screen">
      {isVerifying && (
        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center z-20 bg-white">
          <PulseLoader color="#000" />
          <p className="text-2xl font-semibold mt-4">Verifying Payment...</p>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
          <p className="text-sm text-gray-400 mt-4">Transaction ID: {transaction_id}</p>
        </div>
      )}

      {!isVerifying && isVerified && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <FaRegCircleCheck className="text-green-500 text-6xl" />
          <p className="text-2xl font-semibold">Payment Successful!</p>
          <p className="text-gray-600">Your order has been confirmed</p>
          {receiptData && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-2">Order ID</p>
              <p className="font-mono text-lg font-semibold mb-4">{receiptData.orderId}</p>
              <p className="text-sm text-gray-500 mb-2">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ₦{receiptData.amount?.toFixed(2) || '0.00'}
              </p>
              {receiptData.transactionId && (
                <>
                  <p className="text-sm text-gray-500 mt-4 mb-2">Transaction ID</p>
                  <p className="font-mono text-xs text-gray-600">{receiptData.transactionId}</p>
                </>
              )}
            </div>
          )}
          <p className="text-gray-600 mt-4">Redirecting to your order history...</p>
        </div>
      )}

      {!isVerifying && !isVerified && error && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <MdError className="text-red-500 text-6xl" />
          <p className="text-2xl font-semibold">Payment Verification Failed</p>
          <div className="mt-4 p-6 bg-red-50 rounded-lg max-w-md">
            <p className="text-red-700 text-center">{error}</p>
          </div>
          <p className="text-gray-600 mt-4">Redirecting back to cart...</p>
          <button 
            onClick={() => navigate("/cart")}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go to Cart Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyPayment;