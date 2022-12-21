import amqp, { Channel } from "amqp-connection-manager";

// Create a new connection manager
const connection = amqp.connect(["amqp://localhost"]);

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
const channelWrapper = connection.createChannel({
  json: true,
  setup: async function (channel: Channel) {
    // `channel` here is a regular amqplib `ConfirmChannel`.
    // Note that `this` here is the channelWrapper instance.
    const xchng = "test";
    const q = await channel.assertQueue("", {
      durable: true,
      exclusive: true,
    });

    const exchange = channel.assertExchange(xchng, "fanout", {
      durable: true,
    });
    console.log({ exchange });
    channel.bindQueue(q.queue, xchng, "");
    // Consume event
    channel.consume(q.queue, (msg: any) => {
      console.log(
        "Received message and acked",
        JSON.parse(msg.content.toString())
      );
      channelWrapper.ack(msg);
    });
    // return exchange;
  },
});
