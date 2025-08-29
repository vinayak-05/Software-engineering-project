import { Link } from 'react-router-dom'

export default function Navbar({ onLogout }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  return (
    <header className='border-b bg-white'>
      <div className='max-w-6xl mx-auto p-4 flex items-center justify-between'>
        <Link to='/' className='text-2xl font-bold'>🌾 AgriB2B</Link>
        <nav className='flex gap-4'>
          <Link to='/marketplace' className='hover:underline'>Marketplace</Link>
          <Link to='/schemes' className='hover:underline'>Schemes</Link>
          {role === 'farmer' && <Link to='/dashboard' className='hover:underline'>Farmer Dashboard</Link>}
        </nav>
        <div className='flex gap-3'>
          {!token ? (
            <>
              <Link to='/login' className='btn bg-black text-white'>Login</Link>
              <Link to='/register' className='btn bg-gray-100'>Register</Link>
            </>
          ) : (
            <button onClick={onLogout} className='btn bg-red-50'>Logout</button>
          )}
        </div>
      </div>
    </header>
  )
}
