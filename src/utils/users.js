let users = []


let addUser = ({id, username , room}) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(! username || !room){
        return {
            error: 'Username and Room are required !'
        }
    }

    //check for exixting users.

    let exixtingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate

    if(exixtingUser){
        return{
            error: 'Username in Use!'
        }
    }

    //store user

    let user = { id , username , room}
    users.push(user)
    return{user}
}

let removeUser = (id) => {
    let index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

let getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
    
}

let getUserinRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserinRoom
}


