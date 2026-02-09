import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"

// every object in this array represents a route in our application
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {}
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
