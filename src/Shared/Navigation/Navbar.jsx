import { Link, Links, NavLink } from "react-router-dom";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { ProductContext } from "../../Context/ProductContext";



const Navbar = () => {

  const { cartCout } = useContext(ProductContext)

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

const  HandlMenuOpen =()=>{
  setIsMenuOpen((prv) => !prv);
};

  return ( 
<div className="sticky top-0 left-0 z-10">
  {/* largescreen */}
  <div className="hidden lg:block">
      <div className="  p-6 flex items-center justify-between bg-primary text-white">

<Link to={"/"} className="Logo font-serif lg:text-2xl sm:text-[10px] md:text-2xl italic font-bold">
Granduer
</Link>

<div className="hidden lg:block">
<div className="Links flex justify-between items-center gap-4">
{
  navlinks.map((item)=>(
<NavLink className={({isActive})=> (isActive? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm":"p-[10px] rounded-3xl text-sm hover:bg-white hover:text-black transition ease-in-out duration-700")} 
to={item.path} 
key={item.id}>{item.name}
</NavLink>
  ))
}
</div>
</div>

<div className="hidden lg:block md:block">
<div className="Cartsearch gap-4 flex justify-between items-center text-sm">
 <button
    onClick={() => setSearchOpen(!searchOpen)}
    className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
    >
  <CiSearch />
  </button>

<Link to={"/login"} className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"> 
<CgProfile /> 
</Link>

     {/* Search Input (Shared for all screens) */}
{searchOpen && (
  <div className="bg-primary py-3 flex justify-center items-center">
    <div className="flex items-center bg-black border border-gray-600 rounded-3xl overflow-hidden w-[85%] lg:w-[40%]">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow px-4 py-2 text-white text-sm outline-none bg-black placeholder-gray-300"
      />
      <button className="px-3 text-white">
        <CiSearch />
      </button>
    </div>
</div>
)}

<span className="h-[27px] w-[27px] rounded-full flex items-center justify-center border-[1px] border-white">
  <NavLink className={({isActive})=> (isActive? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm":"p-[10px] rounded-3xl text-sm hover:bg-white hover:text-black transition ease-in-out duration-700")} 
to="/cart"><SlHandbag />
<span className="absolute border-[1px] border-primary hover:border-white  count top-6 right-3 h-5 w-5 p-2 rounded-full bg-white text-primary flex justify-center items-center font-bold transition ease-in-out duration-500">
{(cartCout && cartCout) || 0}
</span>
</NavLink>
</span>


</div>
</div>


<span className="flex justify-center items-center lg:hidden font-bold text-2xl">
  <CiMenuFries />
</span>



    </div>
  </div>

    {/* smallscreen */}
<div className="lg:hidden block">
      <div className="  p-6 flex items-center justify-between bg-primary text-white">

        <div className="Cartsearch gap-4 flex justify-between items-center text-sm">

<span className="h-[27px] w-[27px] rounded-full flex items-center justify-center border-[1px] border-white">
  <NavLink className={({isActive})=> (isActive? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm":"p-[10px] rounded-3xl text-sm hover:bg-white hover:text-black transition ease-in-out duration-700")} 
to="/cart"><SlHandbag />
<span className="absolute border-[1px] count top-6 left-3 h-5 w-5 p-2 rounded-full bg-white text-primary flex justify-center items-center font-bold">
{(cartCout && cartCout) || 0}
</span>
</NavLink>
</span>
 <button
  onClick={() => setSearchOpen(!searchOpen)}
  className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
  >
  <CiSearch />
  </button>

   {/* Search Input (Shared for all screens) */}
{searchOpen && (
  <div className="bg-primary py-3 flex justify-center items-center">
    <div className="flex items-center bg-black border border-gray-600 rounded-3xl overflow-hidden w-[85%] lg:w-[40%]">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow px-4 py-2 text-white text-sm outline-none bg-black placeholder-gray-300"
      />
      <button className="px-3 text-white">
        <CiSearch />
      </button>
    </div>
</div>
)}


</div>

<Link to={"/"} className="Logo font-serif lg:text-2xl sm:text-[10px] md:text-2xl italic font-bold">
Granduer
</Link>

<div className="hidden lg:block">
<div className="Links flex justify-between items-center gap-4">
{
  navlinks.map((item)=>(
<NavLink className={({isActive})=> (isActive? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm":"p-[10px] rounded-3xl text-sm hover:bg-white hover:text-black transition ease-in-out duration-700")} 
to={item.path} 
key={item.id}>{item.name}
</NavLink>
  ))
}
</div>
</div>


<div className="flex gap-4">

<Link to={"/login"} className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"> 
<CgProfile /> 
</Link>

<span onClick={()=> HandlMenuOpen()}
className="flex justify-center items-center lg:hidden font-bold text-2xl">
  <CiMenuFries />
</span>
</div>


<div className={` ${isMenuOpen ? "h-52 transition ease-in-out duration-500 block" : "h-0 hidden opacity-0"} absolute left-0 top-[100%] w-full `}>
  <div className="flex flex-col  bg-white text-black w-full gap-4 p-4">
{
  navlinks.map((item)=>(
    <NavLink
      to={item.path}
      key={item.id}
      className={({ isActive }) =>
        isActive
          ? "border-[1px] bg-black text-white rounded-3xl p-[10px] text-sm"
          : "p-[10px] rounded-3xl md:text-sm sm:text-lg lg:font-medium font-semibold bg-white text-black hover:bg-black hover:text-white transition ease-in-out duration-400"
      }
    >
      {item.name}
    </NavLink>
  ))
}
</div>
</div>

    </div>
</div>



</div>
  );
}

export default Navbar;