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

// Send some messages to the queue.  If we're not currently connected, these will be queued up in memory
// until we connect.  Note that `sendToQueue()` and `publish()` return a Promise which is fulfilled or rejected
// when the message is actually sent (or not sent.)
channelWrapper
    .sendToQueue('rxQueueName', { hello: process.argv[2] || 'world' })
    .then(function () {
        return console.log('Message was sent!  Hooray!');
    })
    .catch(function (err) {
        return console.log('Message was rejected...  Boo!');
    });
