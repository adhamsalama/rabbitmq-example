import amqp, { Channel } from 'amqp-connection-manager';

// Create a new connection manager
const connection = amqp.connect(['amqp://localhost']);

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
const channelWrapper = connection.createChannel({
    json: true,
    setup: function (channel: Channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue('rxQueueName', { durable: true });
    },
});

// Consume event
channelWrapper.consume('rxQueueName', (msg) => {
    console.log('Received message', JSON.parse(msg.content.toString()));
    channelWrapper.ack(msg);
});
