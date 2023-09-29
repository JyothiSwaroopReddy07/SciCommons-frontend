
import React, { useState, useEffect } from "react";
import { MessageBox, ChatItem } from "react-chat-elements";
import { TextField, Button, Grid } from "@material-ui/core";
import axios from "axios";
import {useNavigate, useParams} from 'react-router-dom';
import {useGlobalContext} from '../../Context/StateContext';

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {channel} = useParams();
  const {token, user} = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(token===null){
        navigate('/login')
    }
    
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const channelName = channel.toString() <= user.username.toString() ? `chat_${channel}_${user.username}` : `chat_${user.username}_${channel}`;
    const wsUrl = `${wsProtocol}://${window.location.host}/ws/chat/${channelName}/`;

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMessage = {
        position: data.sender === user.username ? "right" : "left",
        type: "text",
        text: data.message,
        date: new Date(),
      };
      setMessages([...messages, newMessage]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, [channel, user, messages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const data = {
        message: message,
      };

      axios.post(`https://scicommons-backend.onrender.com/api/chat/`, data).then((response) => {
        setMessage("");
      });
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-green-50">
      <div className="bg-white mx-auto">
        <MessageBox
          title={channel}
          titleColor="black"
          messages={messages}
        />
      </div>
      <Grid container spacing={2} className="bg-white">
        <Grid item xs={10}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChatPage;
