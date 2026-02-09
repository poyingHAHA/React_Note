import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Products from "./pages/Products"
import RootLayout from "./pages/RootLayout"
import Error from "./pages/Error"
import ProductDetail from "./pages/ProductDetail"

// every object in this array represents a route in our application
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/products/:productId',
        element: <ProductDetail />
      }
    ]
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
