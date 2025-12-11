// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../Shared/Layout/Layout";
// import { toast } from "react-toastify";
// import { registerUser, loginUser } from "../Services/userService";

// const Input = ({ type, name, labelFor, value, onChange, placeholder }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-white text-sm font-medium">{labelFor}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className="bg-gray-800 text-white px-4 py-3 rounded-md border border-primary focus:outline-none transition-colors"
//     />
//   </div>
// );

// const Login = ({ onLoginSuccess }) => {
//   const [activeTab, setActiveTab] = useState("login");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userData, setUserData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     image: null,
//   });

//   const navigate = useNavigate();

//   const resetForm = () => {
//     setUserData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//       image: null,
//     });
//   };

//   const handleChange = e => {
//     const { name, value, type, files } = e.target;
//     setUserData(prev => ({
//       ...prev,
//       [name]: type === "file" ? files[0] : value,
//     }));
//   };

//   const switchTab = tab => {
//     setActiveTab(tab);
//     resetForm();
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
    
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     try {
//       // LOGIN FLOW
//       if (activeTab === "login") {
//         // Get local cart from sessionStorage or context
//         const localCart = JSON.parse(sessionStorage.getItem("guestCart") || "[]");

//         const response = await loginUser(
//           {
//             email: userData.email,
//             password: userData.password,
//           },
//           localCart
//         );

//         if (response.ok && response.data.success) {
//           toast.success(response.data.message || "Login successful!");

//           // Extract user data from response (now includes role)
//           const userInfo = response.data.data || response.decodedToken;

//           // Store authentication data in sessionStorage and localStorage
//           const userData = {
//             userid: userInfo.userid,
//             email: userInfo.email,
//             phone: userInfo.phone,
//             address: userInfo.address,
//             image: userInfo.image,
//             role: userInfo.role,
//             firstName: userInfo.firstName,
//             lastName: userInfo.lastName
//           };

//           sessionStorage.setItem("token", response.token);
//           sessionStorage.setItem("userData", JSON.stringify(userData));
          
//           // Also store in localStorage for persistence
//           localStorage.setItem("token", response.token);
//           localStorage.setItem("userData", JSON.stringify(userData));
          
//           // Log user data for verification
//           console.log("✓ User logged in successfully!");
//           console.log("✓ User Role:", userData.role);
//           console.log("✓ User Data saved to localStorage:", userData);
//           console.log("✓ localStorage contents:", {
//             token: localStorage.getItem("token") ? "✓ Token stored" : "✗ No token",
//             userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : "✗ No userData"
//           });

//           // Store merged cart if backend returns it
//           if (response.data.cart) {
//             sessionStorage.setItem("cart", JSON.stringify(response.data.cart));
//             localStorage.setItem("cart", JSON.stringify(response.data.cart));
//           }

//           // Clear guest cart
//           sessionStorage.removeItem("guestCart");

//           // Call parent callback with complete auth data
//           if (onLoginSuccess) {
//             onLoginSuccess({
//               token: response.token,
//               user: userData,
//               cart: response.data.cart || [],
//             });
//           }

//           // Redirect based on user role
//           setTimeout(() => {
//             if (userData.role === "ADMIN") {
//               console.log("✓ Admin detected - redirecting to admin dashboard");
//               window.location.href = "/admin";
//             } else {
//               console.log("✓ Regular user - redirecting to homepage");
//               window.location.href = "/";
//             }
//           }, 500);
//         } else {
//           toast.error(response.data?.message || "Login failed");
//         }
//       }

//       // SIGNUP FLOW
//       if (activeTab === "signup") {
//         const formData = new FormData();
        
//         for (let [key, value] of Object.entries(userData)) {
//           if (!value) continue;
//           if (key === "confirmPassword") {
//             formData.append("confirmpassword", value);
//           } else {
//             formData.append(key, value);
//           }
//         }

//         const response = await registerUser(formData);
        
//         if (response.ok) {
//           toast.success("Account created successfully! Please login.");
//           switchTab("login");
//         } else {
//           toast.error(response.data?.message || "Registration failed");
//         }
//       }

//       // FORGOT PASSWORD FLOW
//       if (activeTab === "forgot") {
//         toast.info("Password reset link would be sent to: " + userData.email);
//         // TODO: Implement password reset API call
//       }

//     } catch (error) {
//       console.error("Form submission error:", error);
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-md bg-primary backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
//         >
//           {/* Header */}
//           <div className="text-center mb-2">
//             <h2 className="text-white text-3xl font-bold mb-2">
//               {activeTab === "login" && "Welcome Back"}
//               {activeTab === "signup" && "Create Account"}
//               {activeTab === "forgot" && "Reset Password"}
//             </h2>
//             <p className="text-primary text-sm">
//               {activeTab === "login" && "Sign in to your account"}
//               {activeTab === "signup" && "Join us today"}
//               {activeTab === "forgot" && "We'll send you a reset link"}
//             </p>
//           </div>

//           {/* Tab Navigation */}
//           {activeTab !== "forgot" && (
//             <div className="flex gap-2 bg-gray-900 p-1 rounded-lg mb-2">
//               <button
//                 type="button"
//                 onClick={() => switchTab("login")}
//                 disabled={isSubmitting}
//                 className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
//                   activeTab === "login"
//                     ? "bg-primary text-white shadow-lg"
//                     : "text-primary hover:text-white"
//                 } disabled:opacity-50`}
//               >
//                 Sign In
//               </button>
//               <button
//                 type="button"
//                 onClick={() => switchTab("signup")}
//                 disabled={isSubmitting}
//                 className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
//                   activeTab === "signup"
//                     ? "bg-primary text-white shadow-lg"
//                     : "text-primary hover:text-white"
//                 } disabled:opacity-50`}
//               >
//                 Sign Up
//               </button>
//             </div>
//           )}

//           {/* Sign Up Form */}
//           {activeTab === "signup" && (
//             <>
//               <Input
//                 type="text"
//                 labelFor="First Name"
//                 value={userData.firstName}
//                 onChange={handleChange}
//                 name="firstName"
//                 placeholder="Enter your first name"
//               />
//               <Input
//                 type="text"
//                 labelFor="Last Name"
//                 value={userData.lastName}
//                 onChange={handleChange}
//                 name="lastName"
//                 placeholder="Enter your last name"
//               />
//               <Input
//                 type="tel"
//                 labelFor="Phone"
//                 value={userData.phone}
//                 onChange={handleChange}
//                 name="phone"
//                 placeholder="Enter your phone number"
//               />
//               <Input
//                 type="email"
//                 labelFor="Email"
//                 value={userData.email}
//                 onChange={handleChange}
//                 name="email"
//                 placeholder="Enter your email"
//               />
//               <Input
//                 type="text"
//                 labelFor="Address"
//                 value={userData.address}
//                 onChange={handleChange}
//                 name="address"
//                 placeholder="Enter your address"
//               />
//               <Input
//                 type="password"
//                 labelFor="Password"
//                 value={userData.password}
//                 onChange={handleChange}
//                 name="password"
//                 placeholder="Create a password"
//               />
//               <Input
//                 type="password"
//                 labelFor="Confirm Password"
//                 value={userData.confirmPassword}
//                 onChange={handleChange}
//                 name="confirmPassword"
//                 placeholder="Confirm your password"
//               />
//               <div className="flex flex-col gap-2">
//                 <label className="text-white text-sm font-medium">Profile Image (Optional)</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
//                 />
//               </div>
//             </>
//           )}

//           {/* Login Form */}
//           {activeTab === "login" && (
//             <>
//               <Input
//                 type="email"
//                 labelFor="Email"
//                 value={userData.email}
//                 onChange={handleChange}
//                 name="email"
//                 placeholder="Enter your email"
//               />
//               <Input
//                 type="password"
//                 labelFor="Password"
//                 value={userData.password}
//                 onChange={handleChange}
//                 name="password"
//                 placeholder="Enter your password"
//               />
//             </>
//           )}

//           {/* Forgot Password Form */}
//           {activeTab === "forgot" && (
//             <Input
//               type="email"
//               labelFor="Email"
//               value={userData.email}
//               onChange={handleChange}
//               name="email"
//               placeholder="Enter your email"
//             />
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-white text-black font-bold py-3 rounded-md hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 Processing...
//               </span>
//             ) : (
//               <>
//                 {activeTab === "login" && "Sign In"}
//                 {activeTab === "signup" && "Create Account"}
//                 {activeTab === "forgot" && "Send Reset Link"}
//               </>
//             )}
//           </button>

//           {/* Forgot Password Link */}
//           {activeTab === "login" && (
//             <p
//               onClick={() => !isSubmitting && switchTab("forgot")}
//               className={`text-sm text-white text-center cursor-pointer hover:text-gray-300 hover:underline transition-colors ${
//                 isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               Forgot Password?
//             </p>
//           )}

//           {/* Back to Login */}
//           {activeTab === "forgot" && (
//             <p
//               onClick={() => !isSubmitting && switchTab("login")}
//               className={`text-sm text-white text-center cursor-pointer hover:underline transition-colors ${
//                 isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               ← Back to Sign In
//             </p>
//           )}

//           {/* Additional Info */}
//           <div className="mt-4 pt-4 border-t border-white">
//             <p className="text-sm text-white text-center">
//               {activeTab === "login" && "New customer? "}
//               {activeTab === "signup" && "Already have an account? "}
//               {activeTab === "forgot" && "Remember your password? "}
//               <span
//                 onClick={() => !isSubmitting && switchTab(activeTab === "signup" ? "login" : "signup")}
//                 className={`text-white font-bold hover:underline transition-colors ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//                 }`}
//               >
//                 {activeTab === "login" && "Create an account"}
//                 {activeTab === "signup" && "Sign in here"}
//                 {activeTab === "forgot" && "Sign in here"}
//               </span>
//             </p>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { toast } from "react-toastify";
import { registerUser, loginUser } from "../Services/userService";

const Input = ({ type, name, labelFor, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-white text-sm font-medium">{labelFor}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-800 text-white px-4 py-3 rounded-md border border-primary focus:outline-none transition-colors"
    />
  </div>
);

const Login = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const navigate = useNavigate();

  const resetForm = () => {
    setUserData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      image: null,
    });
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const switchTab = tab => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // ---------------- LOGIN FLOW ----------------
      if (activeTab === "login") {
        // 1. Get local cart items (Guest Cart)
        const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        console.log("Guest cart before login:", localCart);

        // 2. Call Login API with credentials AND the guest cart
        const response = await loginUser(
          {
            email: userData.email,
            password: userData.password,
          },
          localCart 
        );

        if (response.ok && response.data.success) {
          toast.success(response.data.message || "Login successful!");

          const userInfo = response.data.data || response.decodedToken;

          const userStorageData = {
            userid: userInfo.userid,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            image: userInfo.image,
            role: userInfo.role,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName
          };

          // 3. Store authentication tokens
          sessionStorage.setItem("token", response.token);
          sessionStorage.setItem("userData", JSON.stringify(userStorageData));
          
          localStorage.setItem("token", response.token);
          localStorage.setItem("userData", JSON.stringify(userStorageData));
          
          // 4. ⭐ CRITICAL: Update LocalStorage with the MERGED cart from backend
          // The backend returns 'response.data.cart' which contains DB items + Guest items
          if (response.data.cart && Array.isArray(response.data.cart)) {
            console.log("✓ Backend returned merged cart:", response.data.cart);
            localStorage.setItem("cartItems", JSON.stringify(response.data.cart));
          } else {
            console.log("✓ No cart from backend, clearing local storage");
            localStorage.removeItem("cartItems");
          }

          // 5. Update Parent State (Context)
          if (onLoginSuccess) {
            onLoginSuccess({
              token: response.token,
              user: userStorageData,
              cart: response.data.cart || [],
            });
          }

          // 6. Redirect based on Role
          setTimeout(() => {
            if (userStorageData.role === "ADMIN") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }, 500);
        } else {
          toast.error(response.data?.message || "Login failed");
        }
      }

      // ---------------- SIGNUP FLOW ----------------
      if (activeTab === "signup") {
        const formData = new FormData();
        
        for (let [key, value] of Object.entries(userData)) {
          if (!value) continue;
          if (key === "confirmPassword") {
            formData.append("confirmpassword", value);
          } else {
            formData.append(key, value);
          }
        }

        const response = await registerUser(formData);
        
        if (response.ok) {
          toast.success("Account created successfully! Please check your email.");
           setIsVerificationPending(true);
        } else {
          toast.error(response.data?.message || "Registration failed");
        }
      }

      // ---------------- FORGOT PASSWORD FLOW ----------------
      if (activeTab === "forgot") {
        toast.info("Password reset link would be sent to: " + userData.email);
        // Add actual API call here later
      }

    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-primary backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-white text-3xl font-bold mb-2">
              {activeTab === "login" && "Welcome Back"}
              {activeTab === "signup" && "Create Account"}
              {activeTab === "forgot" && "Reset Password"}
            </h2>
            <p className="text-primary text-sm">
              {activeTab === "login" && "Sign in to your account"}
              {activeTab === "signup" && "Join us today"}
              {activeTab === "forgot" && "We'll send you a reset link"}
            </p>
          </div>

          {/* Tab Navigation */}
          {activeTab !== "forgot" && !isVerificationPending && (
            <div className="flex gap-2 bg-gray-900 p-1 rounded-lg mb-2">
              <button
                type="button"
                onClick={() => switchTab("login")}
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-primary text-white shadow-lg"
                    : "text-primary hover:text-white"
                } disabled:opacity-50`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab("signup")}
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-primary text-white shadow-lg"
                    : "text-primary hover:text-white"
                } disabled:opacity-50`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Verification Pending Message */}
          {isVerificationPending && (
            <div className="text-center py-8">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                <p className="font-bold text-lg mb-2">Registration Successful!</p>
                <p>We have sent a verification email to: <br/><strong>{userData.email}</strong></p>
                <p className="mt-4 text-sm">Please check your email and click the link to verify your account.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                   setIsVerificationPending(false);
                   switchTab("login");
                }}
                className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && !isVerificationPending && (
            <>
              <Input
                type="text"
                labelFor="First Name"
                value={userData.firstName}
                onChange={handleChange}
                name="firstName"
                placeholder="Enter your first name"
              />
              <Input
                type="text"
                labelFor="Last Name"
                value={userData.lastName}
                onChange={handleChange}
                name="lastName"
                placeholder="Enter your last name"
              />
              <Input
                type="tel"
                labelFor="Phone"
                value={userData.phone}
                onChange={handleChange}
                name="phone"
                placeholder="Enter your phone number"
              />
              <Input
                type="email"
                labelFor="Email"
                value={userData.email}
                onChange={handleChange}
                name="email"
                placeholder="Enter your email"
              />
              <Input
                type="text"
                labelFor="Address"
                value={userData.address}
                onChange={handleChange}
                name="address"
                placeholder="Enter your address"
              />
              <Input
                type="password"
                labelFor="Password"
                value={userData.password}
                onChange={handleChange}
                name="password"
                placeholder="Create a password"
              />
              <Input
                type="password"
                labelFor="Confirm Password"
                value={userData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                placeholder="Confirm your password"
              />
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Profile Image (Optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                />
              </div>
            </>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <>
              <Input
                type="email"
                labelFor="Email"
                value={userData.email}
                onChange={handleChange}
                name="email"
                placeholder="Enter your email"
              />
              <Input
                type="password"
                labelFor="Password"
                value={userData.password}
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
              />
            </>
          )}

          {/* Forgot Password Form */}
          {activeTab === "forgot" && (
            <Input
              type="email"
              labelFor="Email"
              value={userData.email}
              onChange={handleChange}
              name="email"
              placeholder="Enter your email"
            />
          )}

          {/* Submit Button */}
          {!isVerificationPending && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black font-bold py-3 rounded-md hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {activeTab === "login" && "Sign In"}
                {activeTab === "signup" && "Create Account"}
                {activeTab === "forgot" && "Send Reset Link"}
              </>
            )}
          </button>
          )}

          {/* Forgot Password Link */}
          {activeTab === "login" && (
            <p
              onClick={() => !isSubmitting && switchTab("forgot")}
              className={`text-sm text-white text-center cursor-pointer hover:text-gray-300 hover:underline transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Forgot Password?
            </p>
          )}

          {/* Back to Login */}
          {activeTab === "forgot" && (
            <p
              onClick={() => !isSubmitting && switchTab("login")}
              className={`text-sm text-white text-center cursor-pointer hover:underline transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ← Back to Sign In
            </p>
          )}

          {/* Additional Info */}
          {!isVerificationPending && (
          <div className="mt-4 pt-4 border-t border-white">
            <p className="text-sm text-white text-center">
              {activeTab === "login" && "New customer? "}
              {activeTab === "signup" && "Already have an account? "}
              {activeTab === "forgot" && "Remember your password? "}
              <span
                onClick={() => !isSubmitting && switchTab(activeTab === "signup" ? "login" : "signup")}
                className={`text-white font-bold hover:underline transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {activeTab === "login" && "Create an account"}
                {activeTab === "signup" && "Sign in here"}
                {activeTab === "forgot" && "Sign in here"}
              </span>
            </p>
          </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Login;