import fastify, {FastifyInstance, FastifyRequest, FastifySchema} from "fastify";
// import fs from "fs"; better do this at userDB logic
import type { Logger } from "pino";
import {buildUserDB} from './admin/usersDB';
import { buildAdminRouting } from "./admin-router";


const userUtils = buildUserDB();


export function buildSv(logger: Logger): FastifyInstance{
    const myServer = fastify({logger});
    const adminRoutesPlugin = buildAdminRouting(userUtils);
    myServer.get('/', {}, (req, reply) => {
        reply
            .status(200)
            .headers({'content-type': 'text/html'})
            .send(`<html>
            <head>
                <title>My playground</title>
            </head>
            <body>
                <div>
                    <h1>Welcome to my first fastify backend implementation!</h1>
                    <h2>I know it's not much but you are able to:</h2>
                    <ul>
                        <li>CRUD (GET, POST, PUT, DELETE) at /admin</li>
                        <li>Read at /users</li>
                    </ul>
                </div>
            </body>
        </html>`)
    });


    myServer.get('/users', {}, (req, reply) => {
        let resp = userUtils.getUserList();
        reply
            .status(200)
            .headers({'content-type': 'application/json'})
            .send({resp})
    });

    myServer.register(adminRoutesPlugin, {prefix: '/admin'})

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
      reply.send(new Error('The page youre looking for doesnt exist...')); 
   });
/*
    myServer.decorateReply('notFound', () => {
      this.code(404).send(new Error('The page youre looking for doesnt exist... :('));
    }); */

    return myServer;
}


/*
function parseJsonDB(mode: string, body?: userDTO | undefined, id?: number | undefined): object | object[]{
    let myResponse:  any;
    let rawData: any = fs.readFileSync('./users/users.json');
    if(!mode) throw new Error();
    if(mode == 'post'){
        myResponse = JSON.parse(rawData);
        myResponse.push(body);
        let newUser = JSON.stringify(myResponse);
        fs.writeFile('./users/users.json', 'utf-8', myResponse);
    }
    if(mode == 'put'){
        myResponse = JSON.parse(rawData);

        fs.writeFile('./users/users.json', 'utf-8', myResponse)
    }
    if(mode == 'delete'){
        let objToDelete = JSON.parse(rawData);
        //let fixedObj = objToDelete.find(x => x.id == id);
        //myResponse = JSON.stringify(fixedObj.splice(fixedObj.id, 1));
        fs.writeFile('./users/users.json', 'utf-8', myResponse);
    }
    if(mode == 'get'){
       myResponse = JSON.parse(rawData);
    }
    if(mode == 'getList'){
        myResponse = JSON.parse(rawData);
    }
    return myResponse;
}



fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' }
    ],
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: {type: 'string', format: 'email' }
        }
      }
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true
})

fastify.put('/some-route/:id', {
  schema: {
    description: 'post some data',
    tags: ['user', 'code'],
    summary: 'qwerty',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'user id'
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        hello: { type: 'string' },
        obj: {
          type: 'object',
          properties: {
            some: { type: 'string' }
          }
        }
      }
    },
    response: {
      201: {
        description: 'Successful response',
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      },
      default: {
        description: 'Default response',
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      }
    },
    security: [
      {
        "apiKey": []
      }
    ]
  }
}, (req, reply) => {})

fastify.ready(err => {
  if (err) throw err
  fastify.swagger()
})

*/