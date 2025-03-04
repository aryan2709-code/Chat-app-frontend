import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["Hi There"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Corrected URL

    ws.onmessage = (event) => {
      setMessages((m) => [...m, JSON.parse(event.data)]); // Parse incoming message
    };

    ws.onopen = () => {
      wsRef.current = ws;
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputRef.current && wsRef.current) {
      const message = inputRef.current.value;
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
          },
        })
      );
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className="p-2 bg-gray-100 rounded mb-2 max-w-xs break-words"
          >
            {message}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="border p-2 rounded mr-2 flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white border rounded-lg p-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;