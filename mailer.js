const nodemailer = require("nodemailer");
const {YOUR_DOMAIN} = require("./server");
// const GOOGLE_USER = process.env.GOOGLE_USER;
// const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD;

const sendEmail = (message) => {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASSWORD
            }
        })

        transporter.sendMail(message, function(err, info) {
            if (err) {
                rej(err)
            } else {
                res(info)
            }
        })
    })
}


exports.sendResetPasswordEmail = ({toUser, hash}) => {
    const message = {
        from: process.env.GOOGLE_USER,
        // to: toUser.email // in production uncomment this
        to: process.env.GOOGLE_USER,
        subject: 'Your App - Reset Password',
        html: `
      <h3> Hello ${toUser.username} </h3>
      <p>To reset your password please follow this link: <a target="_" href="http://localhost:3000/reset/${hash}">http://localhost:3000/reset</a></p>
      <p>This link will be expired in 10 minutes</p>
      <p>Your Application Team</p>
    `
    };
    return sendEmail(message);
}

// exports.sendConfirmationEmail = ({toUser, hash}) => {
//     const message = {
//         from: process.env.GOOGLE_USER,
//         // to: toUser.email // in production uncomment this
//         to: process.env.GOOGLE_USER,
//         subject: 'Your App - Activate Account',
//         html: `
//       <h3> Hello ${toUser.username} </h3>
//       <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
//       <p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/activate/user/${hash}">${process.env.DOMAIN}/activate </a></p>
//       <p>Cheers</p>
//       <p>Your Application Team</p>
//     `
//     };
//     return sendEmail(message);
// }