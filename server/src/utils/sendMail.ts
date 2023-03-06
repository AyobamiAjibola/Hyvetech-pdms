import nodemailer from "nodemailer"
import "dotenv/config"

export const sendMail : any = async (data: any)=>{
    // 

    const transporter = nodemailer.createTransport({
        // @ts-ignore
        host: <string>process.env.SMTP_CONFIG_HOST,
        port: <string>process.env.SMTP_CONFIG_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
        user: <string>process.env.SMTP_CONFIG_USERNAME, // generated ethereal user
        pass: <string>process.env.SMTP_CONFIG_PASSWORD, // generated ethereal password
        },
  });

  // send mail with defined transport object
  const info: any = await transporter.sendMail(data);

  console.log(info, "info")
}