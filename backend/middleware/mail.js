const nodemailer = require('nodemailer');
const MAIL_SETTINGS = {
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async (params, idIsFrance = false) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: 'Hello ', // Subject line
      html: idIsFrance
        ? `<div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
        <h2>Welcome to our MSPR2.</h2>
        <p>Nouvelle connexion à votre compte associé</p>
        <p style="font-size: 20px; letter-spacing: 2px; text-align:center;">${params.to}</p>
        <p style="margin-bottom: 30px;">Nous avons détecté une nouvelle connexion à votre compte. Si cétait vous, aucune action de votre part est requis.</p> 
        <p>Dans le contraire, veuillez contacter l'administration</p>
        </div>`
        : `<div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
    <h2>Welcome to our MSPR2.</h2>
    <h4>Tu es bien dedans</h4>
    <p style="margin-bottom: 30px;">Veuillez entrer le code OTP pour vous inscrire</p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
    <p style="margin-top:50px;">Si vous n'êtes pas à l'origine de la demande de vérification , veuillez ne pas répondre à ce mail.</p>
    </div>`,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
