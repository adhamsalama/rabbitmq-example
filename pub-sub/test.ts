import amqp from 'amqp-connection-manager';
import { UserCreatedPublisher } from './publishers/user-created-publisher';
import { UserCreatedListener } from './subscribers/user-created-listener';

const connection = amqp.connect(['amqp://localhost']);

(async () => {
    console.log('here');
    await new UserCreatedPublisher(connection).publish({
        id: String(Math.random() * 1000),
        email: 'adhom@adhom.com',
        url: 'adhom.com',
    });
    console.log('waited');
    new UserCreatedListener(connection).listen();
})();
