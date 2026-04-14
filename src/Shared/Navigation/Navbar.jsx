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
        <div className="p-6 flex items-center justify-between">
          <Link to={"/"} className="Logo font-serif lg:text-2xl sm:text-[10px] md:text-2xl italic font-bold">
            Granduer
          </Link>

          {!searchOpen ? (
            <>
              <div className="hidden lg:block">
                <div className="Links flex justify-between items-center gap-4 animate-fade-in transition-all">
                  {navlinks.map((item) => (
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "border-[1px] bg-white text-black rounded-3xl px-4 py-2 text-sm font-medium"
                          : "px-4 py-2 rounded-3xl text-sm font-medium hover:bg-white hover:text-black transition ease-in-out duration-300"
                      }
                      to={item.path}
                      key={item.id}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4 text-sm animate-fade-in transition-all">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
                >
                  <CiSearch size={18} />
                </button>

                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Welcome, {user.firstName || user.email}!</span>
                    <Link
                      to="/order-history"
                      className="border-[1px] border-white bg-black px-4 py-2 text-sm hover:bg-blue-700 transition ease-in-out duration-300 rounded-3xl whitespace-nowrap"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="border-[1px] border-white bg-red-600 px-4 py-2 text-sm hover:bg-red-700 transition ease-in-out duration-300 rounded-3xl whitespace-nowrap"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to={"/login"}
                    className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
                  >
                    <CgProfile size={18} />
                  </Link>
                )}

                <span className="h-9 w-9 rounded-full flex items-center justify-center border-[1px] border-white ml-2 transition-all hover:bg-white hover:text-black cursor-pointer">
                  <NavLink to="/liked-products">
                    <FaHeart size={16} />
                  </NavLink>
                </span>
                <span className="h-9 w-9 rounded-full flex items-center justify-center border-[1px] border-white relative transition-all hover:bg-white hover:text-black cursor-pointer">
                  <NavLink to="/cart" className="flex items-center justify-center w-full h-full">
                    <SlHandbag size={16} />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-primary flex justify-center items-center font-bold text-xs border border-primary">
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
        <div className="p-4 flex items-center justify-between">
          {!searchOpen ? (
            <>
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-full flex items-center justify-center border-[1px] border-white relative transition-all hover:bg-white hover:text-black">
                  <NavLink to="/cart" className="flex items-center justify-center w-full h-full">
                    <SlHandbag size={14} />
                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white text-primary flex justify-center items-center font-bold text-[10px] border border-primary">
                      {cartCout || 0}
                    </span>
                  </NavLink>
                </span>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="border-[1px] border-white bg-black p-[6px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-full"
                >
                  <CiSearch size={16} />
                </button>
              </div>

              <Link to={"/"} className="Logo font-serif text-lg italic font-bold">
                Granduer
              </Link>

              <div className="flex items-center gap-3">
                {user ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="border-[1px] border-white bg-red-600 px-3 py-1 text-xs hover:bg-red-700 transition ease-in-out duration-300 rounded-3xl"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to={"/login"}
                    className="border-[1px] border-white bg-black p-[6px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-full"
                  >
                    <CgProfile size={16} />
                  </Link>
                )}

                <button
                  onClick={HandlMenuOpen}
                  className="flex justify-center items-center font-bold text-xl cursor-pointer"
                >
                  <CiMenuFries />
                </button>
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