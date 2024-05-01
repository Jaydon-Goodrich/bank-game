import usePartySocket from "partysocket/react";
import { useParams, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function RoomParam() {
  let params = useParams();
  const roomId = params.id;
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const [message, setMessage] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [clicked, setClicked] = useState<number>(0);

  async function getData(roomId: string | undefined) {
    const req = await fetch(`http://localhost:1999/parties/main/${roomId}`, {
      method: "GET",
    });
    const data = await req.json();
    setPlayers(data.players);
    if (!req.ok) {
      if (req.status === 404) {
        console.log("NOT FOUND");
      } else {
        throw new Error("Something went wrong.");
      }
    }
  }

  const socket = usePartySocket({
    host: "http://localhost:1999",
    room: roomId,
    onMessage(event) {
      const roomData = JSON.parse(event.data);
      setPlayers(roomData.players);
      setClicked(roomData.clicked);
    },
  });

  const sendClick = () => {
    socket.send(JSON.stringify({ clicked: clicked + 1 }));
  };

  const sendPing = () => {
    try {
      const pingMessage = JSON.stringify({ type: "ping", username });
      socket.send(pingMessage);
    } catch (err) {
      console.log("ERR", err);
    }
  };

  useEffect(() => {
    getData(roomId);
    const pingInterval = setInterval(sendPing, 5000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [socket]);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Room ID: {params.id}</h1>
      <h2>Times Clicked: {clicked}</h2>
      <input
        type="text"
        onChange={(evt) => setMessage(evt.target.value)}
        placeholder="here"
      />
      <button onClick={() => sendClick()}>DO SOMETHING</button>
      {/* <h1>BACK:{lastMessage}</h1> */}
      <h1>PLAYERS</h1>
      {players.map((player, index) => (
        <h3 key={player + index}>{player}</h3>
      ))}
    </div>
  );
}
