import { useEffect, useState } from 'react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function Marketplace() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data))
  }, [])

  function addToCart(prod) {
    alert(`Added ${prod.name} to cart (demo)`)
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Marketplace</h2>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {products.map(p => <ProductCard key={p._id} product={p} onAdd={addToCart} />)}
      </div>
    </div>
  )
}
