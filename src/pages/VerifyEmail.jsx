import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../Services/userService";
import { PulseLoader } from "react-spinners";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const hasVerifiedRef = useRef(false); // Prevent double verification

  // Get verification token from URL
  const verificationToken = searchParams.get("token");

  useEffect(() => {
    // Set mounted status
    isMountedRef.current = true;

    const verifyEmail = async () => {
      // Prevent double verification
      if (hasVerifiedRef.current) {
        console.log("Email already verified, skipping...");
        return;
      }

      // Check if we have verification token
      if (!verificationToken) {
        console.error("No verification token found in URL params");
        toast.error("Invalid verification link");
        navigate("/login");
        return;
      }

      // Mark as verifying
      hasVerifiedRef.current = true;

      try {
        setIsVerifying(true);
        console.log("=== STARTING EMAIL VERIFICATION ===");
        console.log("Verification Token:", verificationToken);

        // Call backend to verify email
        const response = await fetch(
          `${baseUrl}verify-email?token=${verificationToken}`,
          {
            method: "GET",
            headers: {
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
          console.log("✓ Email verified successfully");
          setIsVerified(true);
          
          toast.success("Email verified successfully! You can now login.");

          // Redirect to login page after 3 seconds
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              console.log("Redirecting to login page...");
              navigate("/login");
            }
          }, 3000);
        } else {
          // Handle failed verification or server error
          const errorMessage = data.message || data.error || "Email verification failed";
          console.error("✗ Verification failed - Status:", response.status);
          console.error("Error message:", errorMessage);
          console.error("Full response:", data);
          
          setError(errorMessage);
          toast.error(errorMessage);
          
          // Redirect to login after 3 seconds
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              navigate("/login");
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
        toast.error("Email verification failed - Please try again or contact support");
        
        // Redirect to login after 3 seconds
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            navigate("/login");
          }
        }, 3000);
      } finally {
        if (isMountedRef.current) {
          setIsVerifying(false);
        }
      }
    };

    verifyEmail();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [verificationToken, navigate]);

  return (
    <div className="relative min-h-screen">
      {isVerifying && (
        <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center z-20 bg-white">
          <PulseLoader color="#000" />
          <p className="text-2xl font-semibold mt-4">Verifying Email...</p>
          <p className="text-gray-600 mt-2">Please wait while we verify your email address</p>
        </div>
      )}

      {!isVerifying && isVerified && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <FaRegCircleCheck className="text-green-500 text-6xl" />
          <p className="text-2xl font-semibold">Email Verified Successfully!</p>
          <p className="text-gray-600">Your account has been verified</p>
          <div className="mt-4 p-6 bg-green-50 rounded-lg text-center max-w-md">
            <p className="text-green-700">
              You can now login to your account and start shopping!
            </p>
          </div>
          <p className="text-gray-600 mt-4">Redirecting to login page...</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go to Login Now
          </button>
        </div>
      )}

      {!isVerifying && !isVerified && error && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <MdError className="text-red-500 text-6xl" />
          <p className="text-2xl font-semibold">Email Verification Failed</p>
          <div className="mt-4 p-6 bg-red-50 rounded-lg max-w-md">
            <p className="text-red-700 text-center">{error}</p>
            <p className="text-sm text-gray-600 mt-4 text-center">
              This link may have expired or already been used. Please request a new verification email.
            </p>
          </div>
          <p className="text-gray-600 mt-4">Redirecting to login page...</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go to Login Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;