import { Routes, Route } from 'react-router-dom'
import LoginSU from './components/LoginSU'
import ProtectRoute from './utils/ProtectRoute'
import Logged from './components/Logged'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginSU />} />
      <Route
        path="/"
        element={
          <ProtectRoute>
            <Logged />
          </ProtectRoute>
        }
      />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}
