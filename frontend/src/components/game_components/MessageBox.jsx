import React from 'react'
import { useRef, useEffect} from 'react';

const MessageBox = ({message, messages, sendMessage, setMessage}) => {
    //console.log(messages);

    const chatListRef = useRef();
    const messagesEndRef = useRef();

    const scrollToBottom = () => {
       // const target = chatListRef.current;
        console.log("Scroll to bottom");
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        /* if(target.scrollHeight - target.clientHeight <= target.scrollTop + 1){
           // console.log("Scrollheight:",target.scrollHeight);
           console.log("Scrollheight useEffect:",target.scrollHeight);
           //target.scrollTop = target.scrollHeight - target.clientHeight;
        } */
        //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }

    useEffect(()=>{
        

        if(chatListRef.current.scrollHeight - chatListRef.current.clientHeight <= chatListRef.current.scrollTop + 20){
            scrollToBottom();
         }
         console.log('messages', messages);
        
    }, [messages]);

    const handleScroll = (event) => {
        const target = event.target;

        if(target.scrollHeight - target.scrollTop === target.clientHeight){
            //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            console.log("SCROLL TO BOOTTOM")
        }

        if(target.scrollHeight - target.clientHeight <= target.scrollTop + 1 ){
            console.log("Scrollheight:",target.scrollHeight);
           //target.scrollTop = target.scrollHeight - target.clientHeight;
        }
    }

    const messageKeyHandler = (e) => {
        //console.log("letter -", e.key);
        //console.log("Messages", message)
        if(e.key == 'Enter'){
          sendMessage();
        }
    };

    
  return (
        <div>
            <h2>Messages:</h2>
                <ul ref={chatListRef} onScroll={handleScroll}>
                    {messages.map((msg, index) => (
                        <li key={"msg-"+index}>{msg.chatter ? msg.chatter+': '+msg.message : msg}</li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
                
                <div className='messageInput'>
                    <input type="text" value={message} onKeyDown={messageKeyHandler} onChange={(e) => setMessage(e.target.value)}></input>
                    <button onClick={sendMessage}>Post</button>
                </div>
        </div> 
  )
}

export default React.memo(MessageBox);