import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { clearToken } from '../utils/auth'

export default function Logged() {
    const nav = useNavigate()

    const logout = () => {
        clearToken()
        nav('/login', { replace: true })
    }

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <Button type="primary" onClick={logout}>
                Cerrar sesión
            </Button>
        </div>
    )
}