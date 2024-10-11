import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
      <h1 className="underline">This is Frontend and </h1>
      <h1 className="font-bold">{message}</h1>
    </>
  );
}

export default App;
