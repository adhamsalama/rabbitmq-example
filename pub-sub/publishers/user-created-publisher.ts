import { Publisher } from './base-publisher';
import { UserCreatedEvent } from '../events/user-created-event';
import { Exchanges } from '../exchange';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    readonly exchangeName = Exchanges.USER_CREATED;
}
