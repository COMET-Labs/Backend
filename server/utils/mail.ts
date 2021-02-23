import nodemailer from 'nodemailer';
import Users from '../models/users';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER_EMAIL, // generated ethereal user
    pass: process.env.SENDER_EMAIL_PASSWORD // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return parseInt(OTP);
}

export async function sendPersonalOTP(receiver, id) {
  try {
    let otp = generateOTP();
    const output = `
      <p>
      Hello your OTP is ${otp}
      </p>
      <br>
      <h5>Thanks & Regards</h5>
      <h5>Team COMET</h5>
    `;
    let mailOptions = {
      from: '"PROJECT:COMET"comet.iiitians@gmail.com', // sender address
      to: receiver, // list of receivers
      subject: 'Verify your Email', // Subject line
      html: output // html body
    };
    let user = await Users.updateOne(
      { _id: id },
      { otp: { personal: { value: otp, expire_time: Date.now() + 12000000 } } }
    );
    let info = await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
}
