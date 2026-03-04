import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Form, Input, Segmented, message, Typography } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { isAuthed, setToken } from '../utils/auth'
import { ApiFetch } from '../utils/ApiFetch'

type Mode = 'login' | 'signup'

export default function LoginSU() {
    const [mode, setMode] = useState<Mode>('login')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const [form] = Form.useForm()

    useEffect(() => {
        if (isAuthed()) nav('/', { replace: true })
    }, [nav])

    const title = useMemo(() => (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'), [mode])

    const onSubmit = async (values: { email: string; password: string }) => {
        setLoading(true)
        try {
            const url = mode === 'login' ? '/auth/login' : '/auth/signup'
            const res = await ApiFetch<{ token: string }>(url, {
                method: 'POST',
                body: JSON.stringify(values),
            })

            if (!res?.token) throw new Error('Respuesta inválida: falta token')
            setToken(res.token)
            message.success(mode === 'login' ? 'Sesión iniciada' : 'Cuenta creada')
            nav('/', { replace: true })
        } catch (e: Error | unknown) {
            message.error(e instanceof Error ? e.message : 'Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
            <Card style={{ width: 380, maxWidth: '100%' }}>
                <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 12 }}>
                    {title}
                </Typography.Title>

                <Segmented
                    block
                    value={mode}
                    onChange={(v) => {
                        setMode(v as Mode)

                        if (v === 'login') {
                            form.resetFields()
                        }
                    }}
                    options={[
                        { label: 'Login', value: 'login' },
                        { label: 'Registro', value: 'signup' },
                    ]}
                    style={{ marginBottom: 16 }}
                />

                <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Ingresa tu email' },
                            { type: 'email', message: 'Email inválido' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="test@local.com" autoComplete="email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Ingresa tu password' },
                            { min: 6, message: 'Mínimo 6 caracteres' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="******"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        {mode === 'login' ? 'Entrar' : 'Registrar'}
                    </Button>
                </Form>
            </Card>
        </div>
    )
};
