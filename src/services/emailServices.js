import mailjet from "node-mailjet";

import {
  emailAddress,
  mailjetApiKey,
  mailjetApiSecret,
} from "../../config/index.js";

export const sendMail = async (
  recipientEmailAddress,
  emailBody,
  emailSubject
) => {
  try {
    const nodeMailjet = mailjet.Client.apiConnect(
      mailjetApiKey, //KEY
      mailjetApiSecret // SECRET
    );

    const request = nodeMailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: emailAddress,
            Name: "Uzor",
          },
          To: [
            {
              Email: recipientEmailAddress,
              Name: "Uzor",
            },
          ],
          Subject: emailSubject,
          TextPart: "My first Mailjet email",
          HTMLPart: emailBody,
          CustomID: "101101110",
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};
