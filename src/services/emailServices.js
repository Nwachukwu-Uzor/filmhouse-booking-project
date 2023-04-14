import mailjet from "node-mailjet";

import sgMail from "@sendgrid/mail";

import {
  emailAddress,
  mailjetApiKey,
  mailjetApiSecret,
  sendgridApiKey,
  sendgridVerifiedSender,
} from "../../config/index.js";

export const sendMail = async (
  recipientEmailAddress,
  emailBody,
  emailSubject
) => {
  try {
    // const nodeMailjet = mailjet.Client.apiConnect(
    //   mailjetApiKey, //KEY
    //   mailjetApiSecret // SECRET
    // );

    // const request = nodeMailjet.post("send", { version: "v3.1" }).request({
    //   Messages: [
    //     {
    //       From: {
    //         Email: emailAddress,
    //         Name: "Uzor",
    //       },
    //       To: [
    //         {
    //           Email: recipientEmailAddress,
    //           Name: "Uzor",
    //         },
    //       ],
    //       Subject: emailSubject,
    //       TextPart: "My first Mailjet email",
    //       HTMLPart: emailBody,
    //       CustomID: "101101110",
    //     },
    //   ],
    // });
    // request
    //   .then((result) => {
    //     console.log(result.body);
    //   })
    //   .catch((err) => {
    //     console.log(err.statusCode);
    //   });
    sgMail.setApiKey(sendgridApiKey);
    const msg = {
      to: recipientEmailAddress,
      subject: emailSubject,
      text: "Email text",
      from: sendgridVerifiedSender,
      html: emailBody,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};
