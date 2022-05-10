import { MongoClient, Db } from 'mongodb';

export type MongoConfig = {
    host: string;
    port: number;
    database: string;
};
export function buildMongoDatabase({ host, port, database }: MongoConfig) {
    let client: MongoClient;
    let db: Db;
    async function init() {
        const url = `mongodb://${host}:${port}`;
        client = new MongoClient(url);
        await client.connect();
        db = client.db(database);
    }
    
    function getCollectionUsers(){
        return db.collection('users');
    }

    function getCollection() {
        return db.collection('results');
    }

    function getDatabase() {
        return db;
    }

    async function close() {
        await client.close();
    }
    async function AddMongoDb(
        mongo: NOSQL_DB
    ) {
        await mongo.getCollection().insertOne({});
    }

    return {
        init,
        getDatabase,
        getCollection,
        close, 
        AddMongoDb,
        getCollectionUsers
    };
}

export type NOSQL_DB = ReturnType<typeof buildMongoDatabase>;