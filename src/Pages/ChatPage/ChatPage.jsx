import Fab from "@mui/material/Fab"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import { useParams } from "react-router";
import TextField from "@mui/material/TextField";
import Send from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
import { useGlobalContext } from "../../Context/StateContext";


let chatSocket;
const Chat = () => {
    const [Messages, setMessages] = useState([]);
    const [Message, setMessage] = useState({'message':'','name':''});
    const { id } = useParams();
    const {token} = useGlobalContext();
    const name = localStorage.getItem("user_id");


    useEffect(() => {

            chatSocket = new WebSocket(
                'wss://'
                + 'scicommons-backend.onrender.com'
                + '/ws/chat/'
                + id
                + '/'
            );
    
    }, [])

    const getMessages = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                article: id,
            }
        }
        axios.get(`https://scicommons-backend.onrender.com/api/article_chat/`,config)
        .then((response) => {
            setMessages(response.data);
        })
        .catch((error) => {
            console.error('Error fetching chat messages:', error);
        });
    }

    useEffect(() => {
        getMessages();
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            setMessages([...Messages,data.message])
        };
    }, [Messages])

    function handleSubmit(e) {
        e.preventDefault()
        if(Message)
        {
            chatSocket.send(JSON.stringify({
                'message': Message,
                'article': id
            }));
            setMessage({'message':'','name':''});
        }
    }
    return (
        <>
        <Container>
                <Box sx={{"maxHeight":"80vh","height":"80vh", "overflowY":"scroll"}}>
                    { Messages.map((msg, i) => {
                    return (
                        <div key={i} style={{"margin":"20px"}}>
                            <ListItemText align={msg.personal ? "right" : "left"} primary={msg.message}></ListItemText>
                            <ListItemText align={msg.personal ? "right" : "left"} secondary={`user ${msg.sender}`}></ListItemText>                            
                        </div>)
                    })}
                </Box>
            
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={9} sm={11}>
                        <TextField fullWidth onKeyPress={(e)=> e.key === 'Enter' ? handleSubmit : null}
                        onChange={(e)=> setMessage({'message':e.target.value,'name':name})} variant="standard" value={Message.message} />
                    </Grid>
                    <Grid item xs={3} sm={1}>
                        <Fab component="button" type="submit" color="primary"><Send/></Fab>
                    </Grid>
                </Grid>
            </Box>
        </Container>
        </>
    )
}

export default Chat