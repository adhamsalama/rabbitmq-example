import { Listener } from './base-listener';
import { Exchanges } from '../exchange';
import { UserCreatedEvent } from '../events/user-created-event';
import { ConsumeMessage } from 'amqplib';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    readonly exchangeName = Exchanges.USER_CREATED;
    readonly queueGroupName = 'service1';
    onMessage(data: UserCreatedEvent['data'], msg: ConsumeMessage): void {
        console.log(data);
        this.channelWrapper.ack(msg);
    }
}
