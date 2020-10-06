import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', (connection: any): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST

    if(connection) {
      const { author } = connection;

      app.channel('anonymous').leave(connection);

      app.channel('authenticated').join(connection);

      app.channel(`authors/${author._id}`).join(connection);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.publish((data: any, hook: HookContext) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  app.service('products').publish('created', data => {
    const message = `Product with ${data._id} was created!`;

    return app.channel(`authors/${data.author}`)
      .send({
        message
      });
  });

  app.service('products').publish('patched', data => {
    const message = `Product with ${data._id} was edited!`;

    return app.channel(`authors/${data.author}}`)
      .send({
        message
      });
  });

  app.service('products').publish('updated', data => {
    const message = `Product with ${data._id} was udpated!`;

    return app.channel(`authors/${data.author}}`)
      .send({
        message
      });
  });
}
