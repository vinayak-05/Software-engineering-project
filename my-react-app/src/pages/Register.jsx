import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.token, data.user.role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto card'>
      <h2 className='text-xl font-semibold mb-3'>Create Account</h2>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}
      <form className='grid gap-3' onSubmit={submit}>
        <input className='border rounded-lg p-2' placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className='border rounded-lg p-2' type='email' placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className='border rounded-lg p-2' type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <select className='border rounded-lg p-2' value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value='farmer'>Farmer</option>
          <option value='customer'>Customer</option>
        </select>
        <button 
          className='btn bg-black text-white disabled:bg-gray-400' 
          type='submit'
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
