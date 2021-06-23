import nodemailer, { SentMessageInfo } from 'nodemailer'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import Mail from 'nodemailer/lib/mailer'

export default class EMail {
  transporter: Mail
  constructor() {
    const { EMAIL_PASS, EMAIL_USER } = process.env
    const poolOptions = {
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
    }

    const smtpOptions = {
      // host: 'smtp.ethereal.email',
      service: 'qq',
      port: 465,
      secureConnection: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    }
    const options: SMTPTransport.Options = {
      ...poolOptions,
      ...smtpOptions,
    }
    this.transporter = nodemailer.createTransport(options)
  }

  send(options: Mail.Options): Promise<SentMessageInfo> {
    return this.transporter.sendMail(options)
  }
}
