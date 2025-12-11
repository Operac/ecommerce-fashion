import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import NewArrivals from './pages/NewArrivals.jsx'
import WomenCloths from './pages/WomenCloths.jsx'
import ChildrenCloths from './pages/ChildrenCloths.jsx'
import Cart from './pages/Cart.jsx'
import ProductProvider, { ProductContext } from './Context/ProductContext.jsx'
import Login from './pages/Login.jsx'
import SingleProduct from './pages/SingleProduct.jsx'
import MenCloths from './pages/MenCloths.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import VerifyPayment from './pages/VerifyPayment.jsx'
import ThankYou from './pages/ThankYou.jsx'
import Orders from './pages/Orders.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import LikedProducts from './pages/LikedProducts.jsx'


const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <About />,
        path: "about",
      },
      {
        element: <Contact />,
        path: "contact",
      },
      {
        element: <NewArrivals/>,
        path: "newarrivals",
      },
      {
        element: <MenCloths />,
        path: "mencloths",
      },
      {
        element: <WomenCloths />,
        path: "womencloths",
      },
      {
        element: <ChildrenCloths/>,
        path: "childrencloths",
      },
      {
        element:<Cart/>,
        path: "cart"
      },
            {
        element: <Login />,
        path: "login"
      },
      {
        element: <SingleProduct />,
        path: "product/:id"
      },
      {
        element: <AdminDashboard />,
        path: "admin"
      },
            {
        element: <VerifyPayment />,
        path: "verifypayment"
      },
      {
        element: <ThankYou />,
        path: "thank-you"
      },
      {
        element: <Orders />,
        path: "orders"
      },
      {
        element: <OrderHistory />,
        path: "order-history"
      },
                  {
        element: <VerifyEmail />,
        path: "verify-email"
      },
      {
        element: <LikedProducts />,
        path: "liked-products"
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
<ProductProvider >
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
</ProductProvider>
)
