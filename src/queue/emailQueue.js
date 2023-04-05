import amqp from "amqplib";
import { sendMail } from "../services/index.js";

const rabbitMQUrl = "amqp://localhost";
const queueName = "email-queue";

async function connect() {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    return channel;
  } catch (error) {
    console.error(error);
  }
}

export const emailChannel = await connect();

async function consumeMessage() {
  try {
    const message = await emailChannel.consume(queueName, async (msg) => {
      const emailParameters = JSON.parse(msg.content.toString());
      sendMail(
        emailParameters?.email,
        emailParameters?.body,
        emailParameters?.subject
      );
      emailChannel.ack(msg);
    });
    console.log("Waiting for messages");
  } catch (error) {
    console.log(error);
  }
}

consumeMessage();
