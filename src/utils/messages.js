let generateMessage = ( username ,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()

    }
}

let generateLoc = (username, loc) => {
    return {
        username,
        loc,
        createdAt: new Date().getTime()

    }
}
module.exports = {
    generateMessage,
    generateLoc
}