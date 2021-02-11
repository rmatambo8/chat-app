import React from 'react';
import './App.css';
import io from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
const SOCKET = "http://localhost:8080/";
// const socket = io.connect(SERVER);
// const localStorage = localStorage
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Message = styled.td`
  padding: 1rem;
  margin: 0.25rem;
  float: right;
  background: inherit;
  border-radius: 10px;
  border: 1px black solid;
`;

const MessageBig = styled.td`
  padding: 1rem;
  margin: 0.25rem;
  background: rgba(62, 229, 215, 0.50);;
  border-radius: 10px;
  border: 1px black solid;
`;

const Response = styled.td`
  padding: 1rem;
  margin: 0.25rem;
  float: left;
  background: #f4f7f9;
  border-radius: 10px;
  border: 1px black solid;
`;

const FullPage = styled.div`
  box-sizing: border-box;
  display: flex; 
  height: 100vh;
  width: 100%;
  align-items: center;
  background-color: #46516e;
  flex-direction: column;
`;

const Button = styled.button`
  width: 100%;
  color: #fff;
  background-color: rgba(62,229,215, 0.50);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
`;

const Input = styled.input`
  width: 92%;
  color: rgba(62,229,215, 0.50);
  background-color: #fff;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  display: inline-block;
  font-weight: 400;
  text-align: center;
`;

const Form = styled.form`
  width: 400px;
`;

function App() {
  const [userId, setUserId] = useState();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [current, setCurrent] = useState('');
  const [username, setUsername] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("loading...");
  const localStorage = window.localStorage;

  const addMessage = (msg) => {
    setMessages( m => [...m, msg])
  };
  
  const socketRef = useRef();
  useEffect(() => {
    fetch(SOCKET + 'connect')
    .then(() => {
      socketRef.current = io.connect(SOCKET); 
      socketRef.current.on("user id", (id) => {
        if (localStorage && !!localStorage.getItem('id')) {
          id = localStorage.getItem('id')
        } else {
          id = id.slice(id.length - 6)
          localStorage.setItem('id', id)
        }
  
        setUserId(id);
          
        console.log(id, "<=my id");
        
      });
  
      socketRef.current.on("connection", () => {
        console.log(`I'm connected with the back-end`);
      });
      socketRef.current.on("message", (msg) => {
        console.log(msg)
        addMessage(msg)
      });

      setHasMessages(true)
      
    })
    .catch(error => {
      console.log("this is the Error: ", error)
      setConnectionStatus('unable to connect');
      setHasMessages(false)
    })
  }, [localStorage]);

  const renderMessages = () => {
    return (messages.map((m, i) => {
      if (m.id === userId) return (
        <tr style={{ color: '#F6F6F6', border: "1px solid red", textAlign: 'right' }} key={i}>
          <Message>{current ? current : m.id}: {m.body}</Message>
        </tr>
      )
      return (
        <tr style={{ textAlign: 'left', border: "1px solid black" }} key={i}>
          <td>{m.id}:{m.body}</td>
        </tr>
      )
    }))
  }
  // setMessages(m => m.concat([whatever]))

  const sendMessage = (message) => {
    socketRef.current.emit("sendMessage", { id: userId, body: message });
    setMessage("");
  };

  const head = {
    backgroundColor: 'aqua',
    fontFamily: "monospace",
    fontSize: '1.3rem',
    textAlign: 'center',
  };

  if (!hasMessages) return (
  <FullPage>
    <MessageBig
      onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(62,229,215, 0.50)'}
      onClick={() => alert('please try again later')}
    >
      {connectionStatus}
    </MessageBig>
  </FullPage>
  );

  return (
    <FullPage>
      <div style={{ height: '100%', width: '90%', marginTop: '5%', marginLeft: '5%', marginRight: '5%', backgroundColor: 'rgba(62,229,215, 0.50)', border: '1px solid aqua' }}>
        <table className='Table' style={{ tableLayout: 'fixed', width: '100%'}}>
          <thead style={{display: 'block'}}>
            <tr>
              <td style={ head }>Messages</td>
            </tr>
          </thead>
          <tbody style={{ height: '80%', overflowY: 'auto', display: 'block'}} id="table-msg">
            {renderMessages()}
          </tbody>
        </table>
      </div>
      <Controls>
        <Form onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message);
          }
        }>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='new message...'/>
          <Button type="submit" disabled={!hasMessages}>Send Message</Button>
        </Form>
        <Form onSubmit={(e) => {
          e.preventDefault()
          localStorage.setItem('id', username)
          socketRef.current.emit('set user id', username)
          setCurrent(username)
          setUsername('')
        }}>
          <Input value={username} onChange={ ({target}) => setUsername(target.value) } placeholder="username" />
          <Button type="submit">Add username</Button>
        </Form>
      </Controls>
    </FullPage>
  );
}
export default App;
