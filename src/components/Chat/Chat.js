import React,{useState,useEffect} from 'react'
import './Chat.css'
import queryString from 'query-string';
import io from 'socket.io-client'
import { useLocation } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = () => {
 const location = useLocation();
  const [name,setName]=useState('');
  const [room,setRoom]=useState('');
  const [users, setUsers] = useState('');
  const [message,setMessage]=useState('');
  const [messages,setMessages]=useState([]);
  const ENDPOINT='localhost:5000';

  useEffect(()=>{
    
    //geting data from url
    const {name,room}=queryString.parse(location.search);

    socket=io(ENDPOINT);
  
    setName(name);
    setRoom(room);

    socket.emit('join',{name,room},(error)=>{
      if(error){
        alert(error);
      }
    });
    console.log('useEffect triggered'+ENDPOINT);
    console.log('useEffect triggered'+location.search);

  },[ENDPOINT,location.search]);

  useEffect(() => {
    socket.on('message',(message)=>{
      setMessages([...messages,message]);
    });

    // socket.on("roomData", ({users}) => {
    //   setUsers(users);
    // });
  },[messages]);

  
 const sendMessage=(event)=>{
  event.preventDefault(); //prevent refreshing of page when key is pressed because it is default behaviour

  if(message){
    socket.emit('sendMessage',message,()=>setMessage(''));
  }
 }
 
 console.log(message,messages);

  return (
    <div className='outerContainer'>
      <div className='container'>
          <InfoBar room={room}/>
          <Messages messages={messages} name={name}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat;