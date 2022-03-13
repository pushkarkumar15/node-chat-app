let express = require('express')
let http = require('http')
let hbs = require('hbs')
let path = require('path')
let socketio = require('socket.io')
let Filter = require('bad-words')
let {generateMessage, generateLoc} = require('./utils/messages')
let {addUser, getUser , removeUser, getUserinRoom} = require('./utils/users')


let viewpath = path.join(__dirname,'../templates/views')
let partialPath = path.join(__dirname,'../templates/partials')
let publicDirectoryPath = path.join(__dirname,'../public')

let app = express()
let server = http.createServer(app)
let io = socketio(server)

app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialPath)

//let count = 0
io.on('connection',(socket) => {
    console.log('Web socket connected')

    // socket.emit('message', generateMessage('Welcome'))
    // socket.broadcast.emit('message',generateMessage('A new user has joined'))

    //socket.emit , io.emit , socket.broadcast.emit
    //              io.to.emit , socket.broadcast.to.emit

    socket.on('join',({username, room}, callback) => {
       let {error, user} = addUser({id: socket.id, username , room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
       
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserinRoom(user.room)
        })


        callback()

    })



    socket.on('msg',(msg,callback) => {
        let filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('Bad word not allowed')
        }
        let user = getUser(socket.id)


        io.to(user.room).emit('message',generateMessage(user.username, msg))
        callback()

    })

    socket.on('location',(longitude,latitude,callback) => {
        let user = getUser(socket.id)
        io.to(user.room).emit('locmessage', generateLoc(user.username, `https://google.com/maps?q=${longitude},${latitude}`))
        callback()
    })

    socket.on('disconnect',() => {
        let user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
        
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserinRoom(user.room)
            })
        }
        
    })



})

app.get('/chatapp',(req, res) => {
    res.send('Chat APP')
})
app.get('/index',(req,res) => {
    res.render('index',{
        title: 'Chat APP',
        name: 'Pushkar Kumar',
        test: 'Hello'
    })
})
let port = process.env.PORT || 3000
server.listen(port,() => {
    console.log('Server up on port 3000')
})

