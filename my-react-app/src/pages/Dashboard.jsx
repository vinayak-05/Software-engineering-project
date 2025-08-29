import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Dashboard() {
  const [myProducts, setMyProducts] = useState([])
  const [form, setForm] = useState({ name: '', category: '', price: '', unit: 'kg', quantity: '' })
  const [predictForm, setPredictForm] = useState({ crop: '', location: '', quantity: 100 })

  useEffect(() => {
    api.get('/products/mine').then(res => setMyProducts(res.data))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const res = await api.post('/products', form)
    setMyProducts(prev => [res.data, ...prev])
    setForm({ name: '', category: '', price: '', unit: 'kg', quantity: '' })
  }

  const predict = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/pricing/predict', predictForm)
    alert(`Predicted price: ₹ ${data.price}`)
  }

  return (
    <div className='grid md:grid-cols-2 gap-6'>
      <div className='card'>
        <h3 className='text-lg font-semibold mb-3'>List New Crop</h3>
        <form className='grid gap-3' onSubmit={submit}>
          <input className='border rounded-lg p-2' placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <input className='border rounded-lg p-2' placeholder='Category' value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required/>
          <div className='grid grid-cols-2 gap-3'>
            <input className='border rounded-lg p-2' type='number' placeholder='Price (₹)' value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/>
            <select className='border rounded-lg p-2' value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
              <option>kg</option><option>quintal</option><option>tonne</option>
            </select>
          </div>
          <input className='border rounded-lg p-2' type='number' placeholder='Quantity' value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/>
          <button className='btn bg-black text-white' type='submit'>Publish</button>
        </form>
      </div>

      <div className='card'>
        <h3 className='text-lg font-semibold mb-3'>Price Prediction (Demo)</h3>
        <form className='grid gap-3' onSubmit={predict}>
          <input className='border rounded-lg p-2' placeholder='Crop' value={predictForm.crop} onChange={e=>setPredictForm({...predictForm,crop:e.target.value})} required/>
          <input className='border rounded-lg p-2' placeholder='Location' value={predictForm.location} onChange={e=>setPredictForm({...predictForm,location:e.target.value})} required/>
          <input className='border rounded-lg p-2' type='number' placeholder='Quantity' value={predictForm.quantity} onChange={e=>setPredictForm({...predictForm,quantity:Number(e.target.value)})} required/>
          <button className='btn bg-green-600 text-white' type='submit'>Predict</button>
        </form>
      </div>

      <div className='md:col-span-2 card'>
        <h3 className='text-lg font-semibold mb-3'>My Listings</h3>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {myProducts.map(p => (
            <div key={p._id} className='border rounded-xl p-3'>
              <div className='font-medium'>{p.name}</div>
              <div className='text-sm text-gray-500'>₹ {p.price} / {p.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
