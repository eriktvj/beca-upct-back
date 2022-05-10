import fastify, {FastifyInstance, FastifyRequest, FastifySchema} from "fastify";
// import fs from "fs"; better do this at userDB logic
import type { Logger } from "pino";
import { NOSQL_DB } from './database/mongo-db';
import { buildListPlugin } from "./devices/dev-db";
import { buildGeoJsonPlugin } from "./devices/devices";
import fastifyCors from 'fastify-cors';

export type ServerDeps = {
  logger: Logger;
  dbNoSql: NOSQL_DB;
};


export function buildSv({logger, dbNoSql}: ServerDeps): FastifyInstance{
    const myServer = fastify({logger});
    myServer.get('/', {}, (req, reply) => {
        reply
            .status(200)
            .headers({'content-type': 'text/plain'})
            .send(`Welcome to Erik's Fastify Backend Server.`)
    });

    myServer.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
      preflight: true,
      allowedHeaders: ['Content-Type', 'Accept', 'Description']
    });

    myServer.register(buildGeoJsonPlugin(dbNoSql));
    myServer.register(buildListPlugin(dbNoSql));

    myServer.setSchemaErrorFormatter(function (errors, dataVar){
      myServer.log.error({err: errors}, 'Validation failed')
      return new Error('Something went wrong');
    });

    myServer.setErrorHandler(function (error, request, reply){
      if(error.validation){
        reply.status(422).send(new Error('Validation failed...'));
      }
    });

    myServer.setNotFoundHandler((request, reply) => {      
      reply.send(new Error('The route youre looking for doesnt exist...')); 
   });

    return myServer;
}
