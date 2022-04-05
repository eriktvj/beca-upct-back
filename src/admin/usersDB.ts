export function buildUserDB(){
    const userDB: User[] = [];
    let id = 0;

    type User = {
        readonly id: number,
        name: string,
        age: number
    }

    function getUserList(){
        return [...userDB];
    }

    function addNewUser(newName: string, newAge: number){
        const newUser: User = {
            id: id,
            name: newName,
            age: newAge
        }

        id++;

        userDB.push(newUser);
        return newUser;
    }

    function findUser(id?: number, name?: string){
        if(!!id){
            return userDB.find(u => id === u.id);
        }
        if(!!name){
            return userDB.find(u => name === u.name);
        }
    }

    function editUser(id: number, newName: string, newAge: number){
        let foundIndex = userDB.findIndex(x => x.id == id);
        userDB[foundIndex] = {
            id: id,
            name: newName,
            age: newAge
        }
        return [...userDB];
    }

    function removeUser(id: string){
        let index = 0;
        let aux;
        if(!id) throw new Error();
        if(!!id) {
            let myID = parseInt(id);
            index = userDB.findIndex(user => user.id == myID);
        }
        if(index !== -1){
           return userDB.splice(index, 1);
        }
    }

    return {
        removeUser,
        editUser,
        addNewUser,
        getUserList,
        findUser
    }
}

export type UserDB = ReturnType<typeof buildUserDB>;