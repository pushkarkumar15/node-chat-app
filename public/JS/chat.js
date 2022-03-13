let socket = io()

let messages = document.querySelector('#messages')

//Templates

let messageTemplates = document.querySelector('#message-template').innerHTML
let locTemplates = document.querySelector('#message-template2').innerHTML
let sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
let {username , room} = Qs.parse(location.search,{ignoreQueryPrefix: true})

socket.on('message',(msg) => {
    console.log(msg)
    let html = Mustache.render(messageTemplates,{
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html)

})

socket.on('locmessage',(locmsg) => {
    console.log(locmsg)
    let html = Mustache.render(locTemplates,{
        username: locmsg.username,
        message: locmsg.loc,
        createdAt: moment(locmsg.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({room, users}) => {
    let html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

let form = document.querySelector('form')
let search = document.querySelector('input')
let formbutton = form.querySelector('button')
let button = document.querySelector('#loc')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    formbutton.setAttribute('disabled', 'disabled')
    let msg = search.value
    socket.emit('msg',msg , (message) => {
        formbutton.removeAttribute('disabled', 'disabled')
        search.value = ''
        search.focus()
        if(message){
         return   console.log(message)
        }
        console.log('The message was delevered')
    })
    
   
})

button.addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('Geo loc not supported by browser')
    }
    button.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        button.removeAttribute('disabled', 'disabled')
        socket.emit('location',position.coords.latitude,position.coords.longitude,() => {
            console.log('location delevered')
        })
    })
})

socket.emit('join',{username, room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})