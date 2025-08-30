import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, role, logout } = useContext(AuthContext)

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout()
      navigate('/login')
    }
  }

  const linkClasses = (path) =>
    `hover:underline ${location.pathname === path ? "font-bold underline" : ""}`

  return (
    <header className="border-b bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">🌾 AgriB2B</Link>

        <nav className="flex gap-4">
          <Link to="/marketplace" className={linkClasses("/marketplace")}>Marketplace</Link>
          <Link to="/schemes" className={linkClasses("/schemes")}>Schemes</Link>
          {role === 'farmer' && (
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              Farmer Dashboard
            </Link>
          )}
        </nav>

        <div className="flex gap-3">
          {!token ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200 transition">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
