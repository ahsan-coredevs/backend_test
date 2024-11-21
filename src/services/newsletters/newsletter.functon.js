const sendMail = require("../../controller/email/email");
const subscribersSchema = require("../subscribers/subscribers.schema");

module.exports.sendNewsLetterToSubscribers = async function (content) {
  try {
   
    const subscribers = await subscribersSchema.find();

    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email, 
        subject: 'Hot-Spot News From Edublink',
        html: content,
      };

      
      await new Promise((resolve, reject) => {
        sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error while sending email to ${subscriber.email}:`, error);
            reject(error);
          } else {
            console.log(`Email sent successfully to ${subscriber.email}`);
            resolve(info);
          }
        });
      });
    }

    console.log("All newsletters have been sent successfully.");
  } catch (error) {
    console.error("Error :", error);
  }
};
