import { Navigate } from 'react-router-dom'
import { isAuthed } from './auth'

export default function ProtectRoute({ children }: { children: React.ReactNode }) {
    if (!isAuthed()) return <Navigate to="/login" replace />
    return <>{children}</>
}
