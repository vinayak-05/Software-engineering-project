import { useEffect, useState } from 'react'
import api from "../services/api";   // ✅ must use this, not axios directly


export default function Schemes() {
  const [schemes, setSchemes] = useState([])

  useEffect(() => {
    api.get('/schemes').then(res => setSchemes(res.data))
  }, [])

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-bold text-green-800 text-center'>🌱 Government Schemes</h2>
      <div className='grid md:grid-cols-2 gap-6'>
        {schemes.map(s => (
          <div key={s.id} className='card bg-white rounded-2xl shadow-lg p-6 border'>
            <div className='flex items-center space-x-2 mb-3'>
              <span className='text-green-600 text-xl'>🌾</span>
              <div className='font-semibold text-lg text-green-800'>{s.title}</div>
            </div>
            <p className='text-gray-700 mb-4'>{s.description}</p>
            <a
              className='inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
              href={s.link}
              target='_blank'
              rel='noreferrer'
            >
              Learn more
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
