const amqp = require("amqplib/callback_api");
require("dotenv").config();


// Use environment variables
const rabbitmqUrl =
  process.env.RABBITMQ_URL || "amqp://Prats_RabbitMQ:admin123@localhost:5672";

amqp.connect(rabbitmqUrl, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "tast_queue";

    channel.assertQueue(queue, {
      durable: true
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(" [x] Received '%s'", msg.content.toString());
          channel.ack(msg);
        }
      },
      {
        noAck: false
      }
    );
  });
});
