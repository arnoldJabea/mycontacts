import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Contacts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setLoading(true)
      const data = await api.listContacts()
      setItems(data)
    } catch (err) {
      setError(err.body?.error || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onDelete(id) {
    if (!confirm('Supprimer ce contact ?')) return
    try {
      await api.deleteContact(id)
      setItems(prev => prev.filter(x => x._id !== id))
    } catch (err) {
      alert(err.body?.error || 'Erreur à la suppression')
    }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Mes contacts</h2>
        <Link className="button" to="/contacts/new">+ Nouveau</Link>
      </div>
      {loading ? (<p>Chargement…</p>) : error ? (<p className="error">{error}</p>) : (
        <table className="table">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id}>
                <td>{c.firstName}</td>
                <td>{c.lastName}</td>
                <td>{c.phone}</td>
                <td className="actions">
                  <Link to={`/contacts/${c._id}/edit`}>Modifier</Link>
                  <button className="danger" onClick={() => onDelete(c._id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
