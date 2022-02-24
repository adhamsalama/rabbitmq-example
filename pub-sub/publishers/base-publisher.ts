import amqp, {
    Channel,
    ChannelWrapper,
    AmqpConnectionManager,
} from 'amqp-connection-manager';
import { Exchanges } from '../exchange';

export interface Event {
    exchange: Exchanges;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract exchangeName: T['exchange'];
    protected channelWrapper: ChannelWrapper;

    constructor(connection: AmqpConnectionManager) {
        this.channelWrapper = connection.createChannel({
            json: true,
            setup: (channel: Channel) => {
                // `channel` here is a regular amqplib `ConfirmChannel`.
                return channel.assertExchange(this.exchangeName, 'fanout', {
                    durable: true,
                    arguments: ['x-recent-history'],
                });
            },
        });
    }
    async publish(data: T['data']) {
        return this.channelWrapper
            .publish(this.exchangeName, '', data)
            .then(() => {
                return console.log(
                    `Event published to exchange ${this.exchangeName}`
                );
            })
            .catch(function (err: any) {
                return console.error('Message was rejected...  Boo!', err);
            });
    }
    close() {
        return this.channelWrapper.close();
    }
}
