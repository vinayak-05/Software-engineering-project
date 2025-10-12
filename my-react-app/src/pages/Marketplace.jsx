import { useEffect, useState } from 'react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data))
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddToCart = (prod, qty) => {
    addToCart(prod._id, qty);
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h2 className='text-3xl font-bold text-center'>Marketplace</h2>
      <div className='flex flex-col sm:flex-row gap-4'>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='flex-1 p-2 border rounded'
        />
      </div>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredProducts.map(p => <ProductCard key={p._id} product={p} onAdd={handleAddToCart} />)}
      </div>
    </div>
  )
}
