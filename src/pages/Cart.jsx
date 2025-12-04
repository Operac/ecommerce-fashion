// import React, { useContext, useEffect, useState } from "react";

// import { ProductContext } from "../Context/ProductContext";
// import Layout from "../Shared/Layout/Layout";
// import { RiDeleteBin3Fill, RiEditCircleFill } from "react-icons/ri";
// import { Link } from "react-router-dom";


// import { ImCancelCircle } from "react-icons/im";
// import Edit from "../Components/SingleComponent/Edit";

// const Cart = () => {
//   const { cartItems, cartcout, HandleDeleteCart } = useContext(ProductContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [prod, setProd] = useState(null);
//   const [selectedSize, setSetectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   // useEffect(() => {
//   //   console.log("cartItemss:", cartItems);
//   // }, [cartItems]);

//   useEffect(() => {
//     if (selectedSize) {
//       setProd((prv) => ({ ...prv, size: selectedSize }));
//     }
//     if (selectedColor) {
//       setProd((prv) => ({ ...prv, color: selectedColor }));
//     }
//     if (quantity) {
//       setProd((prv) => ({ ...prv, quantity: quantity }));
//     }
//   }, [selectedColor, selectedSize, quantity]);
//   return (
//     <Layout>
//       <div className="min-h-screen bg-white py-10 px-4 md:px-10 relative  flexCol">
//         <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

// <div
//   className={` ${
//     isModalOpen ? "" : "hidden"
//   } modal min-h-screen bg-transPrimary w-full absolute top-0 `}
// >
//   <span
//     onClick={() => setIsModalOpen(false)}
//     className="absolute top-12 right-10 z-20 flexRow  rounded-full  bg-white text-primary border-[1px] border-primary hover:border-primary hover:bg-primary text-lg font-semibold hover:text-white transition ease-in-out duration-500 cursor-pointer"
//   >
//     <ImCancelCircle className="h-8 w-8" />
//   </span>

//   <Edit
//     prod={prod}
//     setSetectedSize={setSetectedSize}
//     setSelectedColor={setSelectedColor}
//     setQuantity={setQuantity}
//     quantity={quantity}
//     onClose={() => setIsModalOpen(false)}
//   />
// </div>

// {cartItems && cartItems.length > 0 ? (
//           <div className="overflow-x-auto">
//             {/* Table wrapper for desktop */}
//             <table className="hidden md:table min-w-full border border-gray-200 rounded-xl shadow-sm">
//               <thead className="bg-gray-100">
//                 <tr className="text-left text-gray-700">
//                   <th className="py-3 px-4">Product</th>
//                   <th className="py-3 px-4">Price</th>
//                   <th className="py-3 px-4">Quantity</th>
//                   <th className="py-3 px-4">Total</th>
//                   <th className="py-3 px-4 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item, index) => (
//                   <tr
//                     key={index}
//                     className="border-t hover:bg-gray-50 transition"
//                   >
//                     <td className="py-3 px-4 flex items-center gap-3">
//                       <img
//                         src={item?.image}
//                         alt={item?.name}
//                         className="w-12 h-12 object-cover rounded-md"
//                       />
//                       <span className="font-medium">{item?.name}</span>
//                     </td>
//                     <td className="py-3 px-4">${item?.price}</td>
//                     <td className="py-3 px-4">{item?.quantity}</td>
//                     <td className="py-3 px-4 font-semibold">
//                       ${item?.price * item?.quantity}
//                     </td>
//                     <td className="text-center flex justify-between gap-2">
//                       <span
//                         onClick={() => {
//                           console.log("item:", item);

//                           setIsModalOpen(true);
//                           setProd(item);
//                         }}
//                         title="Edit"
//                         className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer"
//                       >
//                         <RiEditCircleFill />
//                       </span>
//                       <span onClick={(e)=>{e.preventDefault()
//                         HandleDeleteCart(item)}
//                       }
//                         title="Delete"
//                         className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer"
//                       >
//                         <RiDeleteBin3Fill />
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Card layout for mobile */}
//             <div className="space-y-4 md:hidden">
//               {cartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-16 h-16 object-cover rounded-md"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-lg">{item.name}</h3>
//                       <p className="text-gray-600">${item.price}</p>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center mt-2 text-sm">
//                     <span>Quantity: {item.quantity}</span>
//                     <span className="font-semibold">
//                       Total: ${item.price * item.quantity}
//                     </span>
//                   </div>

//                   <button className="mt-2 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="flex justify-end mt-6">
//               <div className="bg-gray-100 p-5 rounded-lg w-full sm:w-1/2 md:w-1/3 shadow-sm">
//                 <div className="flex justify-between mb-2 text-gray-700">
//                   <span>Items in Cart:</span>
//                   <span>{cartcout}</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total:</span>
//                   <span>
//                     $
//                     {cartItems
//                       .reduce(
//                         (sum, item) => sum + item.price * item.quantity,
//                         0
//                       )
//                       .toFixed(2)}
//                   </span>
//                 </div>
//                 <button className="mt-5 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition">
//                   Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
//             <p className="text-xl mb-4">Your cart is currently empty 🛒</p>
//             <a
//               href="/"
//               className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
//             >
//               Continue Shopping
//             </a>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Cart;

import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";
import { RiDeleteBin3Fill, RiEditCircleFill } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import Edit from "../Components/SingleComponent/Edit";
import { baseUrl } from "../Services/userService";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

const Cart = () => {
  const { cartItems, cartcout, HandleDeleteCart, User, token, fetchUserCart } = useContext(ProductContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prod, setProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // Fixed typo
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Update prod when size, color, or quantity changes
  useEffect(() => {
    if (prod) {
      setProd((prev) => ({
        ...prev,
        size: selectedSize || prev.size,
        color: selectedColor || prev.color,
        quantity: quantity
      }));
    }
  }, [selectedColor, selectedSize, quantity]);

  // Initialize states when opening edit modal
  const handleEdit = (item) => {
    console.log("Editing item:", item);
    setProd(item);
    setSelectedSize(item.size || "");
    setSelectedColor(item.color || "");
    setQuantity(item.quantity || 1);
    setIsModalOpen(true);
  };

  const HandleInitializePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save order details before payment
      const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderData = {
        items: cartItems,
        total: orderTotal,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      const res = await fetch(`${baseUrl}intializepayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token && token}`
        },
        body: JSON.stringify({email: User && User?.email}),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("data:", data);
        setIsLoading(false);
        setTimeout(()=> {
          toast.success(data?.message);
        }, 3000);
        window.location.href = data?.link;
      } else {
        console.log("data:", data);
        setIsLoading(false);
        toast.error(data?.message)
      }
    } catch (error) {
      console.log("error:", error);
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-10 px-4 md:px-10 relative flexCol">
          {isLoading && (
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-50 bg-transwhite text-black gap-2">
            <p className="text-2xl font-semibold">Loading</p>
            <PulseLoader color="#010101" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

        <div
          className={`${
            isModalOpen ? "" : "hidden"
          } modal min-h-screen bg-transPrimary w-full absolute top-0`}
        >
          <span
            onClick={() => setIsModalOpen(false)}
            className="absolute top-12 right-10 z-20 flexRow rounded-full bg-white text-primary border-[1px] border-primary hover:border-primary hover:bg-primary text-lg font-semibold hover:text-white transition ease-in-out duration-500 cursor-pointer"
          >
            <ImCancelCircle className="h-8 w-8" />
          </span>

          <Edit
            prod={prod}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantity={quantity}
            setQuantity={setQuantity}
            onClose={() => setIsModalOpen(false)}
          />
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Table wrapper for desktop */}
            <table className="hidden md:table min-w-full border border-gray-200 rounded-xl shadow-sm">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span className="font-medium">{item?.name}</span>
                    </td>
                    <td className="py-3 px-4">${item?.price}</td>
                    <td className="py-3 px-4">{item?.quantity}</td>
                    <td className="py-3 px-4 font-semibold">
                      ${item?.price * item?.quantity}
                    </td>
                    <td className="text-center flex justify-between gap-2">
                      <span
                        onClick={() => handleEdit(item)}
                        title="Edit"
                        className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer"
                      >
                        <RiEditCircleFill />
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          HandleDeleteCart(item);
                        }}
                        title="Delete"
                        className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer"
                      >
                        <RiDeleteBin3Fill />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card layout for mobile */}
            <div className="space-y-4 md:hidden">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span>Quantity: {item.quantity}</span>
                    <span className="font-semibold">
                      Total: ${item.price * item.quantity}
                    </span>
                  </div>

                  <button
                    onClick={() => HandleDeleteCart(item)}
                    className="mt-2 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-6">
              <div className="bg-gray-100 p-5 rounded-lg w-full sm:w-1/2 md:w-1/3 shadow-sm">
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Items in Cart:</span>
                  <span>{cartcout}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={(e) => HandleInitializePayment(e)}
                className="mt-5 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
                  >
                  {isLoading ? "Processing..." : "Checkout"}
                  </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
            <p className="text-xl mb-4">Your cart is currently empty 🛒</p>
            <a
              href="/"
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;