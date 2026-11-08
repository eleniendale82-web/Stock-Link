export default function ShopDetailPage({ params }: { params: { shopId: string } }) {
  return <main><h1>Shop {params.shopId}</h1></main>
}
