import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setToken } from '../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/contacts'

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const { token } = await api.login(email, password)
      setToken(token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.body?.error || 'Erreur de connexion')
    }
  }

  return (
    <div className="card">
      <h2>Connexion</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Email
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </label>
        <label>Mot de passe
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <p>Pas de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  )
}
