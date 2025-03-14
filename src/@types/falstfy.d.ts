import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: number[];
      sub: string;
    };
  }
}
