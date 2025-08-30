import { useEffect, useState } from 'react'
import api from "../services/api";   // ✅ must use this, not axios directly


export default function Schemes() {
  const [schemes, setSchemes] = useState([])

  useEffect(() => {
    api.get('/schemes').then(res => setSchemes(res.data))
  }, [])

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Government Schemes</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        {schemes.map(s => (
          <div key={s.id} className='card'>
            <div className='font-semibold text-lg'>{s.title}</div>
            <p className='text-gray-600'>{s.description}</p>
            <a className='underline text-sm' href={s.link} target='_blank' rel='noreferrer'>Learn more</a>
          </div>
        ))}
      </div>
    </div>
  )
}
