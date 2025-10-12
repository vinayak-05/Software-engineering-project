import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [schemes, setSchemes] = useState([])
  const [queries, setQueries] = useState([])
  const [schemeForm, setSchemeForm] = useState({ title: '', description: '', link: '' })
  const [responseForm, setResponseForm] = useState({ id: '', response: '' })

  useEffect(() => {
    fetchUsers()
    fetchSchemes()
    fetchQueries()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (error) {
      alert('Error fetching users')
    }
  }

  const fetchSchemes = async () => {
    try {
      const res = await api.get('/schemes')
      setSchemes(res.data)
    } catch (error) {
      alert('Error fetching schemes')
    }
  }

  const fetchQueries = async () => {
    try {
      const res = await api.get('/support')
      setQueries(res.data)
    } catch (error) {
      alert('Error fetching queries')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
    } catch (error) {
      alert('Error deleting user')
    }
  }

  const addScheme = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/schemes', schemeForm)
      setSchemes([res.data, ...schemes])
      setSchemeForm({ title: '', description: '', link: '' })
    } catch (error) {
      alert('Error adding scheme')
    }
  }

  const deleteScheme = async (id) => {
    if (!confirm('Delete this scheme?')) return
    try {
      await api.delete(`/schemes/${id}`)
      setSchemes(schemes.filter(s => s._id !== id))
    } catch (error) {
      alert('Error deleting scheme')
    }
  }

  const respondQuery = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/support/${responseForm.id}/response`, { response: responseForm.response })
      setQueries(queries.map(q => q._id === responseForm.id ? { ...q, status: 'resolved', response: responseForm.response } : q))
      setResponseForm({ id: '', response: '' })
    } catch (error) {
      alert('Error responding')
    }
  }

  const deleteQuery = async (id) => {
    if (!confirm('Delete this query?')) return
    try {
      await api.delete(`/support/${id}`)
      setQueries(queries.filter(q => q._id !== id))
    } catch (error) {
      alert('Error deleting query')
    }
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Users */}
        <div className='card'>
          <h3 className='text-lg font-semibold mb-3'>Manage Users</h3>
          <div className='space-y-2'>
            {users.map(u => (
              <div key={u._id} className='flex justify-between items-center border p-2 rounded'>
                <div>
                  <div className='font-medium'>{u.name}</div>
                  <div className='text-sm text-gray-500'>{u.email} ({u.role})</div>
                </div>
                <button onClick={() => deleteUser(u._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Schemes */}
        <div className='card'>
          <h3 className='text-lg font-semibold mb-3'>Manage Schemes</h3>
          <form onSubmit={addScheme} className='mb-4 space-y-2'>
            <input className='border rounded p-2 w-full' placeholder='Title' value={schemeForm.title} onChange={e=>setSchemeForm({...schemeForm,title:e.target.value})} required/>
            <textarea className='border rounded p-2 w-full' placeholder='Description' value={schemeForm.description} onChange={e=>setSchemeForm({...schemeForm,description:e.target.value})} required/>
            <input className='border rounded p-2 w-full' placeholder='Link' value={schemeForm.link} onChange={e=>setSchemeForm({...schemeForm,link:e.target.value})} required/>
            <button className='bg-green-500 text-white px-4 py-2 rounded'>Add Scheme</button>
          </form>
          <div className='space-y-2'>
            {schemes.map(s => (
              <div key={s._id} className='border p-2 rounded'>
                <div className='font-medium'>{s.title}</div>
                <button onClick={() => deleteScheme(s._id)} className='mt-1 bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className='card'>
          <h3 className='text-lg font-semibold mb-3'>Support Queries</h3>
          <form onSubmit={respondQuery} className='mb-4 space-y-2'>
            <select className='border rounded p-2 w-full' value={responseForm.id} onChange={e=>setResponseForm({...responseForm,id:e.target.value})} required>
              <option value=''>Select Query</option>
              {queries.filter(q => q.status === 'open').map(q => (
                <option key={q._id} value={q._id}>{q.user.name}: {q.message.slice(0,50)}...</option>
              ))}
            </select>
            <textarea className='border rounded p-2 w-full' placeholder='Response' value={responseForm.response} onChange={e=>setResponseForm({...responseForm,response:e.target.value})} required/>
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Respond</button>
          </form>
          <div className='space-y-2'>
            {queries.map(q => (
              <div key={q._id} className='border p-2 rounded'>
                <div className='font-medium'>{q.user.name} ({q.status})</div>
                <div className='text-sm'>{q.message}</div>
                {q.response && <div className='text-sm text-green-600'>Response: {q.response}</div>}
                <button onClick={() => deleteQuery(q._id)} className='mt-1 bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
