import { transporter } from '../config/nodemailer'

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'Confirma tu cuenta en UpTask',
            text: 'Confirma tu cuenta en UpTask',
            html: `<h1>Confirma tu cuenta en UpTask</h1>
            <p>Hola ${user.name}, confirma tu cuenta en UpTask! Para hacerlo, presiona en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expirara en 10 minutos</p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
        })

        console.log('Email enviado: %s', info.messageId)
    }
}