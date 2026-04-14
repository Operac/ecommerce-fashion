import { Link, Links, NavLink, useNavigate } from "react-router-dom";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { SlHandbag } from "react-icons/sl";
import { useContext, useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { ProductContext } from "../../Context/ProductContext";



const Navbar = () => {

  const { cartCout } = useContext(ProductContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("✓ User data loaded from localStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    setUser(null);
    console.log("✓ User logged out successfully");
    navigate("/login");
  };

  const navlinks = [
    {
      id: 1,
      name: "About",
      path: "/about",
    },
    {
      id: 2,
      name: "Contact",
      path: "/contact",
    },
    {
      id: 3,
      name: "New Arrivals",
      path: "/newarrivals",
    },
        {
      id: 4,
      name: "Men",
      path: "/mencloths",
    },
        {
      id: 5,
      name: "Women",
      path: "/womencloths",
    },
        {
      id: 6,
      name: "Children",
      path: "/childrencloths",
    },
  ];

const [isMenuOpen, setIsMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }
};

const  HandlMenuOpen =()=>{
  setIsMenuOpen((prv) => !prv);
};

  return ( 
    <div className="sticky top-0 left-0 z-50">
      {/* largescreen */}
      <div className="hidden lg:block relative bg-primary text-white">
        <div className="px-6 py-5 flex items-center justify-between max-w-[1400px] mx-auto">
          {!searchOpen ? (
            <>
              {/* LEFT: Logo */}
              <div className="flex-1">
                <Link to={"/"} className="Logo font-serif text-2xl italic font-bold tracking-widest uppercase">
                  Granduer
                </Link>
              </div>

              {/* CENTER: Links */}
              <div className="flex-1 flex justify-center">
                <div className="Links flex justify-center items-center gap-6 animate-fade-in transition-all">
                  {navlinks.map((item) => (
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "text-sm font-bold border-b-2 border-white pb-1 tracking-wide uppercase transition-all duration-300"
                          : "text-sm font-medium tracking-wide uppercase text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500 pb-1 transition-all duration-300"
                      }
                      to={item.path}
                      key={item.id}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* RIGHT: Tools */}
              <div className="flex-1 flex justify-end items-center gap-3 animate-fade-in transition-all relative">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300"
                >
                  <CiSearch size={22} />
                </button>

                {/* Account Dropdown Container */}
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 200)}
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300"
                  >
                    <CgProfile size={20} />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-3 text-black border border-gray-100 z-50 animate-fade-in">
                      {user ? (
                        <>
                          <div className="px-5 py-3 border-b border-gray-100">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-bold truncate mt-1">{user.firstName || user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link to="/order-history" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">My Orders</Link>
                            <Link to="/liked-products" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">Saved Items <FaHeart className="inline-block ml-1 text-red-500" size={12} /></Link>
                          </div>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">Sign out</button>
                          </div>
                        </>
                      ) : (
                        <div className="py-2">
                          <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                            <Link to="/login" className="block w-full text-center bg-black text-white rounded-full py-2 hover:bg-gray-800 transition-colors font-semibold text-sm">Sign In / Register</Link>
                          </div>
                          <Link to="/liked-products" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">Saved Items <FaHeart className="inline-block ml-1 text-gray-300" size={12} /></Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <span className="h-10 w-10 flex items-center justify-center relative hover:bg-white/10 transition-colors duration-300 rounded-full cursor-pointer">
                  <NavLink to="/cart" className="flex items-center justify-center w-full h-full">
                    <SlHandbag size={18} />
                    <span className="absolute top-1 right-1 h-4 w-4 bg-white text-black text-[10px] rounded-full flex justify-center items-center font-bold">
                      {cartCout || 0}
                    </span>
                  </NavLink>
                </span>
              </div>
            </>
          ) : (
            <form onSubmit={handleSearch} className="flex-1 flex justify-center items-center mx-8 animate-fade-in">
              <div className="flex items-center bg-black border border-gray-600 rounded-3xl overflow-hidden w-full max-w-2xl transform transition-all shadow-xl">
                <input
                  type="text"
                  placeholder="Search for clothes, styles, collections..."
                  className="flex-grow px-6 py-3 text-white text-sm outline-none bg-black placeholder-gray-400"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="px-6 text-white hover:bg-white hover:text-black transition-colors h-full py-3 border-l border-gray-700">
                  <CiSearch size={20} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-6 text-sm font-medium hover:text-gray-300 underline underline-offset-4"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* smallscreen */}
      <div className="lg:hidden block bg-primary text-white">
        <div className="p-5 flex items-center justify-between mx-auto max-w-full">
          {!searchOpen ? (
            <>
              {/* MOBILE LEFT: Menu Trigger & Search */}
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={HandlMenuOpen}
                  className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <CiMenuFries size={22} />
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <CiSearch size={22} />
                </button>
              </div>

              {/* MOBILE CENTER: Logo */}
              <Link to={"/"} className="Logo font-serif text-lg italic font-bold tracking-widest uppercase flex-1 text-center">
                Granduer
              </Link>

              {/* MOBILE RIGHT: Account Dropdown & Cart */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                {/* Account Container */}
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 200)}
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                  >
                    <CgProfile size={22} />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-3 text-black border border-gray-100 z-50 animate-fade-in">
                      {user ? (
                        <>
                          <div className="px-5 py-3 border-b border-gray-100">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-bold truncate mt-1">{user.firstName || user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link to="/order-history" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">My Orders</Link>
                            <Link to="/liked-products" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">Saved Items <FaHeart className="inline-block ml-1 text-red-500" size={12} /></Link>
                          </div>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">Sign out</button>
                          </div>
                        </>
                      ) : (
                        <div className="py-2">
                           <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                            <Link to="/login" className="block w-full text-center bg-black text-white rounded-full py-2 hover:bg-gray-800 transition-colors font-semibold text-sm">Sign In / Register</Link>
                          </div>
                          <Link to="/liked-products" className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium">Saved Items <FaHeart className="inline-block ml-1 text-gray-300" size={12} /></Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <span className="h-10 w-10 flex items-center justify-center relative rounded-full hover:bg-white/10 transition-colors">
                  <NavLink to="/cart" className="flex items-center justify-center w-full h-full">
                    <SlHandbag size={20} />
                    <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-white text-black text-[9px] rounded-full flex justify-center items-center font-bold">
                      {cartCout || 0}
                    </span>
                  </NavLink>
                </span>
              </div>
            </>
          ) : (
            <form onSubmit={handleSearch} className="flex-1 flex justify-center items-center gap-3 animate-fade-in w-full">
              <div className="flex items-center bg-black border border-gray-600 rounded-3xl overflow-hidden w-full relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow px-4 py-2 text-white text-sm outline-none bg-black placeholder-gray-400"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="px-4 text-white hover:bg-white hover:text-black transition-colors h-full py-2 border-l border-gray-700">
                  <CiSearch size={18} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs font-semibold px-2 hover:text-gray-300 whitespace-nowrap uppercase tracking-wider"
              >
                Close
              </button>
            </form>
          )}
        </div>

        <div
          className={`absolute left-0 top-[100%] w-full bg-white text-black shadow-2xl transition-all duration-300 overflow-hidden ${
            isMenuOpen && !searchOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2 px-6">
            {navlinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-black text-white rounded-xl px-4 py-3 text-sm font-semibold"
                    : "px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition ease-in-out duration-200"
                }
              >
                {item.name}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/order-history"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-50 text-blue-600 hover:bg-gray-100 transition ease-in-out"
              >
                Order History
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;