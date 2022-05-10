import { NOSQL_DB } from '../database/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
    FastifyReply,
    FastifyRequest,
} from 'fastify';

export type GeoJsonDTO = {
    type: string,
    properties: {
        desc: string,
        session: string | number,
        ns: number,
        timestamp: number,
        beacons: []
    },
    geometry: {
        type: string,
        coordinates: [number, number]
    }
};

export function buildGeoJsonPlugin(dbNoSql: NOSQL_DB){
    return async function GeoJsonPlugin(server: FastifyInstance, opts: FastifyRegisterOptions<Record<string, unknown>>, next: () => void){
        server.post<{Body: GeoJsonDTO}>('/devices', {}, async (req, reply) =>{
            const receivedGeoJson = req.body;
            if(receivedGeoJson){
                await dbNoSql.getCollection().insertOne(receivedGeoJson);


                reply.code(201).headers({'content-type': 'application/json'}).send(receivedGeoJson);
            }
        });
        next();
    }
}