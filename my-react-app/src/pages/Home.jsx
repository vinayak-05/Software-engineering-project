import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center py-16 px-6 max-w-6xl mx-auto">
      
      {/* Left Content */}
      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold leading-tight text-green-800">
          🌾 Direct Farm-to-Business Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
          Empowering <span className="font-semibold text-green-700">farmers</span> and 
          <span className="font-semibold text-green-700"> buyers</span> with direct connections. 
          No middlemen, just <span className="font-semibold">transparent prices</span>, 
          <span className="font-semibold"> ML-based insights</span>, and 
          <span className="font-semibold"> government scheme alerts</span>.
        </p>
        
        <div className="flex gap-4">
          <Link 
            to="/marketplace" 
            className="px-6 py-3 rounded-2xl shadow-md bg-green-700 text-white font-semibold hover:bg-green-800 transition"
          >
            Explore Marketplace
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-2xl shadow-md bg-green-700 text-white font-semibold hover:bg-green-800 transition"
          >
            Join Now
          </Link>
        </div>
      </div>

      {/* Right Content */}
      <div className="card bg-white rounded-2xl shadow-lg p-6 border">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">🚀 How it works</h3>
        <ol className="list-decimal pl-5 space-y-3 text-gray-700">
          <li><span className="font-semibold">Farmers</span> list crops with quantity, unit, and desired price.</li>
          <li><span className="font-semibold">Buyers</span> search and place orders directly.</li>
          <li>Secure <span className="font-semibold">authentication</span> with role-based access.</li>
          <li>Smart <span className="font-semibold">dashboards</span> show live schemes & price predictions.</li>
        </ol>
      </div>
    </section>
  )
}
