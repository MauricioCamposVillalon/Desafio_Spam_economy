const nodemailer = require("nodemailer");


function enviar(to, subject, html) {
    return new Promise((resolve, reject)=> {

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'prueba.mauriciocampos@gmail.com',
                pass: 'JAVI123456'
            },
            tls: {rejectUnauthorized: false}
          });
          let mailOptions = {
            from: "prueba.mauriciocampos@gmail.com",
            to,
            subject,
            html,
          };
          transporter.sendMail(mailOptions, (err, data) => {
            if (err) reject(err);
            if (data){
              
              resolve(data);
            } 
          });
    })

}

module.exports = enviar;
