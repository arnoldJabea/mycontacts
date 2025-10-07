import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function EditContact({ mode }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(mode === 'edit')
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        try {
          setLoading(true)
          const c = await api.getContact(id)
          setFirstName(c.firstName)
          setLastName(c.lastName)
          setPhone(c.phone)
        } catch (err) {
          setError(err.body?.error || 'Chargement impossible')
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [mode, id])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (mode === 'create') {
        await api.createContact({ firstName, lastName, phone })
      } else if (id) {
        await api.updateContact(id, { firstName, lastName, phone })
      }
      navigate('/contacts')
    } catch (err) {
      const msg = err.body?.error || err.body?.errors?.join(', ') || 'Erreur de sauvegarde'
      setError(msg)
    }
  }

  if (loading) return <p>Chargement…</p>

  return (
    <div className="card">
      <h2>{mode === 'create' ? 'Nouveau contact' : 'Modifier le contact'}</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Prénom
          <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </label>
        <label>Nom
          <input value={lastName} onChange={e => setLastName(e.target.value)} required />
        </label>
        <label>Téléphone
          <input value={phone} onChange={e => setPhone(e.target.value)} required />
          <small>10–20 chiffres. Les espaces et symboles seront ignorés.</small>
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="submit">Enregistrer</button>
          <Link className="button" to="/contacts">Annuler</Link>
        </div>
      </form>
    </div>
  )
}
