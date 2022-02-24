import amqp, { Channel, AmqpConnectionManager } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';

class UserCreatedListener {
    queueGroupName = 'UserCreated';
    private channelWrapper: any;
    constructor(connection: AmqpConnectionManager) {
        // this.connection = amqp.connect(['amqp://localhost']);
        this.channelWrapper = connection.createChannel({
            json: true,
            setup: (channel: Channel) => {
                // `channel` here is a regular amqplib `ConfirmChannel`.
                return channel.assertQueue('something else', {
                    durable: true,
                });
            },
        });
    }
    listen() {
        // Consume event
        this.channelWrapper.subscribe(
            this.queueGroupName,
            (msg: ConsumeMessage) => {
                console.log(
                    'Received event',
                    JSON.parse(msg.content.toString())
                );
                this.channelWrapper.ack(msg);
            }
        );
    }
}

const sub = new UserCreatedListener(amqp.connect(['amqp://localhost']));
sub.listen();
