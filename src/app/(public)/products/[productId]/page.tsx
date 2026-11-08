export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  return <main><h1>Product {params.productId}</h1></main>
}
