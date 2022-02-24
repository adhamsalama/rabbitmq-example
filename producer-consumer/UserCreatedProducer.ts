import amqp, { Channel, AmqpConnectionManager } from 'amqp-connection-manager';

class UserCreatedPublisher {
    queueGroupName = 'UserCreated';
    private channelWrapper: any;
    constructor(connection: AmqpConnectionManager) {
        // this.connection = amqp.connect(['amqp://localhost']);
        this.channelWrapper = connection.createChannel({
            json: true,
            setup: function (channel: Channel) {
                // `channel` here is a regular amqplib `ConfirmChannel`.
                // Note that `this` here is the channelWrapper instance.
                return channel.assertQueue('UserCreated', {
                    durable: true,
                });
            },
        });
    }
    publish(user: { email: string; username: string; id: string }) {
        this.channelWrapper
            .sendToQueue(this.queueGroupName, user)
            .then(function () {
                return console.log('UserCreatedEvent sent successfully!');
            })
            .catch(function (err: any) {
                return console.log('Message was rejected...  Boo!');
            });
    }
}

const pub = new UserCreatedPublisher(amqp.connect(['amqp://localhost']));
pub.publish({
    email: 'adhom@adhom.com',
    username: 'adhom',
    id: '69420',
});
