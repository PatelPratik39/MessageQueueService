const express = require("express");
const amqp = require("amqplib/callback_api");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const rabbitMqUrl =
  process.env.RABBITMQ_URL ||
  `amqp://localhost:${process.env.RABBITMQ_PORT || 5672}`;

app.use(express.json());

/// Let's create a connection to the RabbitMQ server
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // Create a channel within the connection
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "task_queue";

    // Ensure the queue exists
    channel.assertQueue(queue, {
      durable: true,
    });

    // POST endpoint to send a message to the queue
    app.post("/send", (req, res) => {
      const message = req.body.message;

      channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });

      console.log(" [x] Sent '%s'", message);
      res.status(200).send("Message sent: " + message);
    });

  });
});

app.listen(PORT, () => {
  console.log(`Producer service running on http://localhost:${PORT}`);
});
