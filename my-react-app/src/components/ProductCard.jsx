export default function ProductCard({ product, onAdd }) {
  return (
    <div className='card flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{product.name}</h3>
        <span className='text-sm text-gray-500'>{product.category}</span>
      </div>
      <p className='text-gray-600'>₹ {product.price} / {product.unit}</p>
      <p className='text-sm text-gray-500'>By: {product.farmerName || 'Farmer'}</p>
      <button className='btn bg-green-100' onClick={() => onAdd?.(product)}>Add to Cart</button>
    </div>
  )
}
