import { useState } from 'react'

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col gap-3'>
      {product.image && <img src={product.image} alt={product.name} className='w-full h-32 object-cover rounded' />}
      <h3 className='text-lg font-semibold text-black'>{product.name}</h3>
      <p className='text-gray-600'>₹ {product.price} / {product.unit}</p>
      <p className='text-sm text-gray-500'>By: {product.farmerName || 'Farmer'}</p>
      {product.description && <p className='text-sm text-gray-700 mt-2'><strong>Description:</strong> {product.description}</p>}
      <div className='flex items-center gap-2'>
        <label className='text-sm text-black'>Qty:</label>
        <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value))} className='w-16 p-1 border rounded text-black' />
      </div>
      <button className='btn bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded' onClick={() => onAdd?.(product, quantity)}>Add to Cart</button>
    </div>
  )
}
