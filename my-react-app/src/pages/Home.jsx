import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className='grid md:grid-cols-2 gap-8 items-center py-8'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold'>Direct Farm-to-Business Platform</h1>
        <p className='text-gray-600'>Buyers connect with farmers directly. No middlemen. Transparent prices with ML-based price hints and government scheme alerts.</p>
        <div className='flex gap-3'>
          <Link to='/marketplace' className='btn bg-black text-white'>Explore Marketplace</Link>
          <Link to='/register' className='btn bg-gray-100'>Join Now</Link>
        </div>
      </div>
      <div className='card'>
        <h3 className='text-xl font-semibold mb-2'>How it works</h3>
        <ol className='list-decimal pl-5 space-y-2 text-gray-700'>
          <li>Farmers list crops with quantity, unit and desired price.</li>
          <li>Buyers search and place orders directly.</li>
          <li>Built-in authentication & role-based access.</li>
          <li>Dashboard shows live schemes and price predictions.</li>
        </ol>
      </div>
    </section>
  )
}
