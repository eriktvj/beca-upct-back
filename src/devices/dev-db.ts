import { NOSQL_DB } from '../database/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
    FastifyReply,
    FastifyRequest,
} from 'fastify';


export function buildListPlugin(dbNoSql: NOSQL_DB){
    return async function ListPlugin(server: FastifyInstance, opts: FastifyRegisterOptions<Record<string, unknown>>, next: () => void){
        server.get('/list', {}, async (req, reply) =>{
            const myDb = await dbNoSql.getCollection().find({}).toArray();
            console.log(myDb);
            reply.code(201).headers({'content-type': 'application/json'}).send(myDb);
        });
        next();
    }
}