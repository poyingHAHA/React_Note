import { useParams } from 'react-router-dom'

export default function ProductDetail() {
    const { productId } = useParams();

    return (
        <h1>Product Detail Page for product {productId}</h1>
    )
}