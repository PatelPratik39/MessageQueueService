import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const response = await fetch("http://localhost:3001/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
        // body: JSON.stringify({ message: "Hello from React" })
      });

      if (!response.ok) {
        throw new Error("Network responses was not Ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <h1> Message Queue Service using MERN Stack </h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <hr />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </>
  );
}

export default App;
