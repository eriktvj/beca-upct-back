import { FastifyInstance, FastifyRegisterOptions, FastifyRequest, FastifySchema } from "fastify";
import { buildUserDB, UserDB } from "./admin/usersDB";


export function buildAdminRouting(userUtils: UserDB) {

    type userDTO = {
        id: number,
        name: string,
        age: number
    };
    
    
    const AddUserSchema: FastifySchema = {
        body: {
            type: 'object',
            properties: {
                id: { type: 'number'},
                name: { type: 'string'},
                age: { type: 'number'}
            }
        }
    };
    
    const UpdateSchema: FastifySchema = {
        body: {
            type: 'object',
            properties: {
                id: { type: 'number'},
                name: { type: 'string'},
                age: { type: 'number'}
            },
            required: ['name', 'age']
        }
    };


    return function pluginAdmin(myServer: FastifyInstance, options: FastifyRegisterOptions<{}>, next: () => void ) {
        myServer.get('/', {}, (req, reply) => {
            let resp = userUtils.getUserList();
            reply
                .status(200)
                .headers({'content-type': 'application/json'})
                .send({resp})
        });
        
        myServer.post<{Body: userDTO}>('/', { schema: AddUserSchema}, 
                    (req, reply) => {
                        const {body} = req;
                        myServer.log.info(`Attempting to create user ${body}...`);
                        let resp = userUtils.addNewUser(body.name, body.age);
                        reply
                            .status(200)
                            .headers({'content-type': 'application/json'})
                            .send({resp})
        });
        
        myServer.put<{Body: userDTO}>('/', { schema: UpdateSchema},
                    (req, reply) => {
                        const {body} = req;
                        myServer.log.info(`Attempting to update user ${body}...`);
                        let resp = userUtils.editUser(body.id, body.name, body.age);
                        reply
                            .status(200)
                            .headers({'content-type': 'application/json'})
                            .send({resp})
        });
        
        myServer.delete('/:id', 
        (req: FastifyRequest<{Params: {id: string}}>, reply) => {
            const {id} = req.params;
            myServer.log.info(`Attempting to delete user with id ${id}...`);
            let resp = userUtils.removeUser(id);
            reply
                .status(200)
                .headers({'content-type': 'application/json'})
                .send({resp})
        });
    

        next();
    }


    
}

