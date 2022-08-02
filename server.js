import mongoose from 'mongoose';
import express from 'express';
import userComponent from './Components/userComponent.js';
import {createServer} from 'http';
import  * as io from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.REACT_APP_PORT || 8000;
const server = createServer(app)
server.listen(port, () => console.log(`Server is running at ${port}........`))
app.get("/",(req,res) => res.send("Hurray! server is running..."))

let username = process.env.REACT_APP_USERNAME
console.log(username)
const password = process.env.REACT_APP_PASSWORD
const url = "mongodb+srv://username:password@cluster0.7jqqszg.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.use("/users", userComponent);

const socketIo = new io.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});;

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log("MongoDB database connected.");

    const changeStream = connection.collection('users').watch({ fullDocument: 'updateLookup' });

    changeStream.on('change', (change)=>{
        switch(change.operationType){
            case 'insert':
                const user = {
                    _id: change.fullDocument._id,
                    firstName: change.fullDocument.firstName,
                    lastName: change.fullDocument.lastName,
                    created: change.fullDocument.created,
                    designation: change.fullDocument.designation,
                    workLocation: change.fullDocument.workLocation,
                    phoneNumber: change.fullDocument.phoneNumber,
                }
                socketIo.emit('user-added', user)
                break;

            case 'update':
                const updatedUser = {
                    _id: change.fullDocument._id,
                    firstName: change.fullDocument.firstName,
                    lastName: change.fullDocument.lastName,
                    created: change.fullDocument.created,
                    designation: change.fullDocument.designation,
                    workLocation: change.fullDocument.workLocation,
                    phoneNumber: change.fullDocument.phoneNumber,
                }
                socketIo.emit('user-updated',updatedUser)
                break;

            case 'delete':
                socketIo.emit('user-deleted', change.documentKey._id)
                break;
        }
    })

})



