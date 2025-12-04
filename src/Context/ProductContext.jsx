import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { baseUrl, logoutUser } from "../Services/userService";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isAuthentified, setIsAuthentified] = useState(false);
  const [cartCout, setCartCount] = useState(0);
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  });

  const [User, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem("userData");
      const sessionUser = sessionStorage.getItem("userData");
      return JSON.parse(localUser || sessionUser || "{}");
    } catch {
      return {};
    }
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  });

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cart");
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("guestCart");
  }, []);

  const clearCartFromDatabase = useCallback(async () => {
    let currentUser = User;
    let currentToken = token;
    
    if (!currentUser?.userid) {
      try {
        const localUser = localStorage.getItem('userData');
        const sessionUser = sessionStorage.getItem('userData');
        currentUser = JSON.parse(localUser || sessionUser || '{}');
      } catch {
        currentUser = {};
      }
    }
    
    if (!currentToken) {
      currentToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    }
    
    if (!currentUser?.userid || !currentToken) {
      return;
    }
    
    try {
      const res = await fetch(`${baseUrl}clearcart/${currentUser.userid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        console.log('✓ Cart cleared from database');
      }
    } catch (error) {
      console.error('Error clearing cart from database:', error);
    }
  }, [User, token]);

  const updateCartFromBackend = useCallback((backendCart) => {
    const newCart = Array.isArray(backendCart) ? backendCart : [];
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));
  }, []);

  const fetchUserCart = useCallback(async (forceRefresh = false) => {
    let currentUser = User;
    let currentToken = token;
    
    if (!currentUser?.userid) {
      try {
        const localUser = localStorage.getItem('userData');
        const sessionUser = sessionStorage.getItem('userData');
        currentUser = JSON.parse(localUser || sessionUser || '{}');
      } catch {
        currentUser = {};
      }
    }
    
    if (!currentToken) {
      currentToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    }
    
    if (!currentUser?.userid || !currentToken) {
      return;
    }
    
    try {
      const res = await fetch(`${baseUrl}getcart/${currentUser.userid}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        const backendCart = data.data.ProductCart || [];
        
        if (backendCart.length === 0) {
          setCartItems([]);
          setCartCount(0);
          localStorage.setItem("cartItems", JSON.stringify([]));
          return;
        }
        
        const frontendCart = backendCart.map(item => ({
          id: item.Product.id,
          name: item.Product.name,
          price: item.Product.price,
          image: item.Product.image,
          quantity: item.quantity,
          size: item.selectedsize,
          color: item.selectedcolor,
        }));
        
        setCartItems(frontendCart);
        localStorage.setItem("cartItems", JSON.stringify(frontendCart));
      } else {
        setCartItems([]);
        localStorage.setItem("cartItems", JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [User, token]);

  const handleLogout = useCallback(() => {
    logoutUser(clearCart);
  }, [clearCart]);

  const HandleGetProducts = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}getAllProducts`, {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok) {
        setProductData(data?.data);
        localStorage.setItem("productData", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error.message);  
    }
  }, []);

  const HandleAddTCart = useCallback(async (prod, quantity = null, size = null, color = null) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItem = storedCartItems.find((item) => parseInt(item.id) === parseInt(prod.id));
      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = storedCartItems.map((item) => 
          parseInt(item.id) === parseInt(prod.id) ? { ...item, quantity: item.quantity + quantity } : item
        );
        toast.info("Product quantity updated in cart");
      } else {
        updatedCartItems = [...storedCartItems, { ...prod, quantity, size, color }];
        toast.success("Product added to cart");
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    } else {
      try {
        const res = await fetch(`${baseUrl}addcart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: User.userid,
            ProductId: prod.id,
            color: color,
            size: size,
            quantity: quantity,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await fetchUserCart(true);
          toast.success(data.message || "Product added to cart");
        } else {
          toast.error(data.message || "Failed to add product to cart");
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
      }
    }
  }, [isAuthentified, token, User, fetchUserCart]);

  const HandleUpdateCart = useCallback(async (productId, newQuantity, newSize = null, newColor = null) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = storedCartItems.map((item) => {
        if (parseInt(item.id) === parseInt(productId)) {
          return { ...item, quantity: newQuantity, size: newSize !== null ? newSize : item.size, color: newColor !== null ? newColor : item.color };
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      toast.success("Cart updated");
    } else {
      try {
        const res = await fetch(`${baseUrl}updatecart`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: User.userid, ProductId: productId, quantity: newQuantity, selectedsize: newSize, selectedcolor: newColor }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await fetchUserCart(true);
          toast.success("Cart updated successfully");
        } else {
          toast.error(data.message || "Failed to update cart");
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
      }
    }
  }, [isAuthentified, token, User, fetchUserCart]);

  const HandleDeleteCart = useCallback(async (productId) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = storedCartItems.filter((item) => parseInt(item.id) !== parseInt(productId));
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      toast.success("Item removed from cart");
    } else {
      try {
        const res = await fetch(`${baseUrl}deletecart/${User.userid}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ProductId: productId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await fetchUserCart(true);
          toast.success("Item removed from cart");
        } else {
          toast.error(data.message || "Failed to remove item");
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
      }
    }
  }, [isAuthentified, token, User, fetchUserCart]);

  useEffect(() => {
    if (User && (User?.role || User?.userid)) {
      setIsAuthentified(true);
      fetchUserCart();
    } else {
      setIsAuthentified(false);
    }
  }, [User, fetchUserCart]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      const newToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (!newToken || !newUserData) {
        setIsAuthentified(false);
        setUser({});
        setToken('');
        clearCart();
      } else {
        try {
          const userData = JSON.parse(newUserData);
          setUser(userData);
          setToken(newToken);
          setIsAuthentified(true);
          const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
          setCartItems(savedCart);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [clearCart]);

  useEffect(() => {
    if (cartItems) {
      const count = cartItems.reduce((acc, curr) => acc + (curr?.quantity || 0), 0);
      setCartCount(count);
    }
  }, [cartItems]);

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  return (
    <ProductContext.Provider
      value={{
        productData,
        HandleGetProducts,
        HandleAddTCart,
        HandleUpdateCart,
        HandleDeleteCart,
        cartItems,
        cartCout,
        isAuthentified,
        User,
        setUser,
        token,
        setToken,
        clearCart,
        clearCartFromDatabase,
        fetchUserCart,
        updateCartFromBackend,
        handleLogout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
export default ProductProvider;