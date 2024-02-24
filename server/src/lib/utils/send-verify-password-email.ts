import {transporter} from '../../config/nodemailer'

type VerifyEmailMailProp = {
    name: string,
    email: string,
    token: string,
    domain: string,

    o: string;
}

export const SendVerifyPasswordEmail = async ({
                                                  name, email, token, domain,o
                                              }: VerifyEmailMailProp) => {
    const sends = await transporter();
    const callback = `${domain}/user/reset-password?token=${token}&email=${email}&o=${o}`
    const htmldata = `<p>Please reset password by clicking on the following link : 
  <a href="${callback}">Reset Password</a></p>`

    await sends.sendMail({
        from: 'Sneek Link Url',
        to: email,
        html: htmldata,
    })
};