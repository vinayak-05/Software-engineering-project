import { useState, useContext } from 'react'
import api from '../lib/api'
import { AuthContext } from '../context/AuthContext'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const { token } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setStatus('Please login to submit a query')
      return
    }
    try {
      await api.post('/support', { message })
      setStatus('Query submitted successfully!')
      setMessage('')
    } catch (error) {
      setStatus('Error submitting query')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-700'>
        <h2 className='text-2xl font-bold text-white mb-6 text-center'>Contact Support</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <textarea
            placeholder='Describe your issue or query'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows='5'
            className='w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <button
            type='submit'
            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg'
          >
            Submit Query
          </button>
        </form>
        {status && (
          <p className={`text-center mt-4 font-medium ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{status}</p>
        )}
      </div>
    </div>
  )
}
