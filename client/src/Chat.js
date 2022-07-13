import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./App.css";
function Chat({ socket, username, room, setShowChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString(),
        noti: "",
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  const Exit = () => {
    if (username !== "" && room !== "") {
      socket.emit("exit", {
        room,
        username,
        time: new Date().toLocaleTimeString(),
      });
      setShowChat(false);
    }
  };
  useEffect(() => {
    socket.on("user_exit", (data) => {
      console.log(data);
      setMessageList([
        ...messageList,
        {
          message: `${data.username} left the conversation room ${data.room} at ${data.time}`,
        },
      ]);
    });
  });
  useEffect(() => {
    socket.on("new_user", (data) => {
      console.log(data);
      setMessageList([
        ...messageList,
        {
          message: `${data.username} Connected in room ${data.room} at ${data.time}`,
        },
      ]);
    });
  });
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      console.log(data);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                {messageContent.noti !== "" ? (
                  <div>
                    <div className="message-meta">
                      <p>
                        <em>
                          {messageContent.message}
                          <p>{messageContent.time}</p>
                        </em>
                      </p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <div className="exitbutton">
        <button onClick={Exit}>Exit</button>
      </div>
    </div>
  );
}

export default Chat;
