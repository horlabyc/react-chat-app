import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/infobar';
import Input from '../Input/Input';
import Messages from '../Messages/messages';
import TextContainer from '../TextContainer/TextContainer';
let socket;

const Chat = ( { location }) => {
    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');
    const endpoint = 'https://react-chat-ap.herokuapp.com/';
    //Hook for Joining a room
    useEffect( () => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);

        socket = io(endpoint);
        socket.emit('join', { name, room }, () => {
           
        });
    }, [endpoint, location.search]);

    //Hook for Sending and receiving messages
    useEffect( () => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
        socket.on('roomData', (roomData) => {
            setUsers(roomData.users);
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [messages]);

    //function for sending messages
    const sendMessage = (e) => {
        e.preventDefault();
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }
    return ( 
        <div className="outerContainer">
            <div className="container">
                <InfoBar room = {room} />
                <Messages  
                    messages = {messages}
                    name = {name}
                />
                <Input 
                    message = {message} setMessage = {setMessage} sendMessage = {sendMessage}
                />
                {/* <TextContainer users = {users}/> */}
            </div>
        </div>
     );
}
 
export default Chat;