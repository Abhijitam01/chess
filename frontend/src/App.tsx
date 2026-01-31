import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to server");
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };
    ws.onclose = () => {
      console.log("Disconnected from server");
      setSocket(null);
    };
    return () => ws.close();
  }, []);

  const joinGame = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "init_game" }));
    }
  };

  const makeMove = () => {
    if (socket) {
      socket.send(JSON.stringify({
        type: "move",
        move: { from: "e2", to: "e4" }
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Chess Game</h1>
      <div className="space-x-4">
        <button 
          onClick={joinGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Join Game
        </button>
        <button 
          onClick={makeMove}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Make Move (e2 to e4)
        </button>
      </div>
      <div className="w-full max-w-md p-4 bg-gray-100 rounded overflow-auto h-64">
        <h2 className="font-semibold mb-2">Logs:</h2>
        {messages.map((msg, i) => (
          <div key={i} className="text-sm border-b py-1">{msg}</div>
        ))}
      </div>
    </div>
  )
}

export default App

