import amqp, {
    Channel,
    ChannelWrapper,
    AmqpConnectionManager,
} from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { Event } from '../publishers/base-publisher';

export abstract class Listener<T extends Event> {
    abstract queueGroupName: string;
    abstract exchangeName: T['exchange'];
    protected channelWrapper: ChannelWrapper;
    abstract onMessage(data: T['data'], msg: ConsumeMessage): void;
    constructor(connection: AmqpConnectionManager) {
        this.channelWrapper = connection.createChannel({
            json: true,
            setup: (channel: Channel) => {
                // `channel` here is a regular amqplib `ConfirmChannel`.
                channel.assertQueue(this.queueGroupName, {
                    durable: true,
                    arguments: ['x-recent-history'],
                });
                const exchange = channel.assertExchange(
                    this.exchangeName,
                    'fanout',
                    {
                        durable: true,
                        arguments: ['x-recent-history'],
                    }
                );
                channel.bindQueue(this.queueGroupName, this.exchangeName, '');
                return exchange;
            },
        });
    }
    listen() {
        // Consume event
        this.channelWrapper.consume(
            this.queueGroupName,
            (msg: ConsumeMessage) => {
                console.log(
                    `Received event ${this.exchangeName} at ${this.queueGroupName}`
                );
                this.onMessage(JSON.parse(msg.content.toString()), msg);
            }
        );
    }
}
