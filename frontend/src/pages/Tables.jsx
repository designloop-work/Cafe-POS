import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, RefreshCw } from 'lucide-react'
import Navbar from '../components/Layout/Navbar'
import TableGrid from '../components/Table/TableGrid'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import Skeleton from '../components/common/Skeleton'
import api from '../services/api'
import { useOrder } from '../context/OrderContext'
import { useNavigate } from 'react-router-dom'
import { notify } from '../utils/toast'

export default function Tables() {
  const [tables, setTables] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ number: '', capacity: 4 })
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { setSelectedTable } = useOrder()
  const navigate = useNavigate()

  const fetchTables = () => {
    setLoading(true)
    api.get('/tables').then((r) => { setTables(r.data); setLoading(false) })
  }
  useEffect(() => { fetchTables() }, [])

  const handleTableClick = (table) => {
    setSelectedTable(table)
    notify.success(`Table ${table.number} selected`)
    navigate('/order')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await api.post('/tables', { number: parseInt(form.number), capacity: parseInt(form.capacity) })
      notify.success('Table added successfully')
      setShowAdd(false)
      setForm({ number: '', capacity: 4 })
      fetchTables()
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Failed to add table')
    } finally {
      setAdding(false)
    }
  }

  const available = tables.filter((t) => t.status === 'available').length

  return (
    <div className="flex flex-col h-full">
      <Navbar title="Tables" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-gray-400"><span className="text-green-400 font-semibold">{available}</span> available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm text-gray-400"><span className="text-red-400 font-semibold">{tables.length - available}</span> occupied</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={fetchTables} className="w-9 h-9 p-0 flex items-center justify-center">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowAdd(true)} className="gap-1.5">
              <Plus size={15} /> Add Table
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tables.map((table, i) => (
              <motion.div key={table.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <TableGrid tables={[table]} onTableClick={handleTableClick} single />
              </motion.div>
            ))}
          </motion.div>
        )}
        {!loading && tables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="text-5xl mb-3">🪑</div>
            <p className="font-medium">No tables yet</p>
            <p className="text-sm mt-1">Add your first table to get started</p>
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Add New Table" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Table Number</label>
              <input type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="input-field" placeholder="e.g. 5" required min={1} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="input-field" placeholder="e.g. 4" min={1} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="secondary" type="button" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
              <Button type="submit" loading={adding} className="flex-1">Add Table</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
