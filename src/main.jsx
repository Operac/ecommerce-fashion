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
      }
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
