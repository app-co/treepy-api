import { app } from './app';
import { env } from './env';

app
  .listen({
    host: 'localhost',
    port: env.PORT,
  })
  .then(() => console.log('server is runing on port', env.PORT));
