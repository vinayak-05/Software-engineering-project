import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setSuccess('Login successful!')
      setTimeout(() => {
        login(data.token, data.user.role)
        navigate('/')
      }, 2000)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className='max-w-md mx-auto card'>
      <h2 className='text-xl font-semibold mb-3'>Login</h2>
      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          {success}
        </div>
      )}
      <form className='grid gap-3' onSubmit={submit}>
        <input className='border rounded-lg p-2' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className='border rounded-lg p-2' type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button className='btn bg-black text-white' type='submit'>Login</button>
      </form>
      <p className='text-sm text-gray-600 mt-3'>No account? <Link className='underline' to='/register'>Register</Link></p>
    </div>
  )
}
