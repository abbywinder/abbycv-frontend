import { createServer, Model } from 'miragejs';

export const makeServer = (environment='development') => {
  return createServer({
    environment,

    models: {
      lifestage: Model,
    },

    seeds(server) {
      server.create('lifestage', { title: 'Lifestage 1' });
      server.create('lifestage', { title: 'Lifestage 2' });
    },

    routes() {
      this.namespace = 'api';

      this.get('/lifestages', (schema) => (schema.lifestages.all()));
      this.get('/not-found', {message: 'Nothing found'}, 404);
      this.get('/error', {message: 'An error has occurred.'}, 500);
      this.post('/lifestages', (schema, request) => {
        const body = JSON.parse(request.requestBody);
        const newLifestage = schema.lifestages.create(body);
        return newLifestage;
      });
      this.post('/not-found', {message: 'Nothing found'}, 404);
      this.post('/error', {message: 'An error has occurred.'}, 500);
    },
  });
};
