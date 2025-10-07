import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Contacts from './pages/Contacts'
import EditContact from './pages/EditContact'
import { getToken, logout } from './lib/auth'
import './styles.css'

function Protected({ children }) {
  const token = getToken()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default function App() {
  const token = getToken()
  return (
    <div className="container">
      <header className="header">
        <h1>MyContacts</h1>
        <nav>
          {token ? (
            <>
              <Link to="/contacts">Mes contacts</Link>
              <button className="link" onClick={() => { logout(); window.location.href = '/login' }}>Se déconnecter</button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/contacts' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contacts" element={<Protected><Contacts /></Protected>} />
          <Route path="/contacts/new" element={<Protected><EditContact mode="create" /></Protected>} />
          <Route path="/contacts/:id/edit" element={<Protected><EditContact mode="edit" /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
