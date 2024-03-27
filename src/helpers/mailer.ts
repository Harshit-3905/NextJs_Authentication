import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }
    const verifyHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
      Verify Your Email or copy and paste the link below in your browser.
      <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`;
    const forgotPasswordHTML = `<p>Click <a href="${process.env.DOMAIN}/forgotpassword?token=${hashedToken}">here</a> to 
      Reset Your Password or copy and paste the link below in your browser.
      <br> ${process.env.DOMAIN}/forgotpassword?token=${hashedToken}
      </p>`;
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "8606760ddc58e3",
        pass: "fb1596a59835a7",
      },
    });
    const mailOptions = {
      from: "harshit@harshit.ai",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset password",
      html: emailType === "VERIFY" ? verifyHTML : forgotPasswordHTML,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};
