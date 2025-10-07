import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null); setOk(null)
    try {
      await api.register(email, password)
      setOk('Compte créé. Vous pouvez vous connecter.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      setError(err.body?.error || 'Erreur à l’inscription')
    }
  }

  return (
    <div className="card">
      <h2>Inscription</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Email
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </label>
        <label>Mot de passe
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <p className="error">{error}</p>}
        {ok && <p className="success">{ok}</p>}
        <button type="submit">Créer le compte</button>
      </form>
      <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </div>
  )
}
