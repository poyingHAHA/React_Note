import { Link, useNavigate } from "react-router-dom"

export default function Home() {

    const navigate = useNavigate();

    const navigateHandler = () => {
        navigate('/products');
    }

    return <>
        <h1>Home Page</h1>
        <p>Go to <Link to="/products">Products</Link></p>
        <button onClick={navigateHandler}>Go to Products</button>
    </>
}
