import { Exchanges } from '../exchange';
import { Event } from '../publishers/base-publisher';
export interface UserCreatedEvent {
    exchange: Exchanges.USER_CREATED;
    data: {
        id: string;
        email: string;
        url: string;
    };
}
