import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Join() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const joinGame = async () => {
    const newPlayer = {
      newPlayer: true,
      username,
    };
    const res = await fetch(`http://localhost:1999/parties/main/${roomId}`, {
      method: "POST",
      body: JSON.stringify(newPlayer),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("RES", res);
    navigate(`/room/${roomId}?username=${username}`);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="w-2/4 md:w-1/3"
        style={{
          width: "30%",
          border: "1px solid black",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center", padding: "25px 0px" }}>JOIN GAME</h1>
        <Input
          className="w-[180px]"
          placeholder="Username"
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
        />
        <Input
          className="w-[180px]"
          placeholder="Room ID"
          value={roomId}
          onChange={(evt) => setRoomId(evt.target.value)}
        />
        <Button onClick={() => joinGame()}>Join Game</Button>
      </div>
    </div>
  );
}
