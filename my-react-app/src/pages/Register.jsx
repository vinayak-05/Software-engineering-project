import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/auth/register', form)
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.user.role)
    navigate('/')
  }

  return (
    <div className='max-w-md mx-auto card'>
      <h2 className='text-xl font-semibold mb-3'>Create Account</h2>
      <form className='grid gap-3' onSubmit={submit}>
        <input className='border rounded-lg p-2' placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className='border rounded-lg p-2' type='email' placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className='border rounded-lg p-2' type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <select className='border rounded-lg p-2' value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value='farmer'>Farmer</option>
          <option value='buyer'>Buyer</option>
        </select>
        <button className='btn bg-black text-white' type='submit'>Register</button>
      </form>
    </div>
  )
}
