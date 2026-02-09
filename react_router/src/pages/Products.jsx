import { Link } from "react-router-dom"

export default function Products() {
    return <>
        <h1>Products Page</h1>
        <ul>
            <li><Link to="/products/1">Product 1</Link></li>
            <li><Link to="/products/2">Product 2</Link></li>
            <li><Link to="/products/3">Product 3</Link></li>
        </ul>
    </>
}