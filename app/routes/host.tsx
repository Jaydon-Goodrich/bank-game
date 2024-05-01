import { useState } from "react";
import { useNavigate } from "@remix-run/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Host() {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<string>("Standard");
  const [rounds, setRounds] = useState<string>("10");
  const [username, setUsername] = useState<string>("");
  const [diceMode, setDiceMode] = useState<string>("");

  const createGame = async () => {
    const randomRoomId = Math.random().toString(36).substring(7);
    const params = new URLSearchParams();
    params.append("gameMode", gameMode.toString());
    params.append("rounds", rounds.toString());
    params.append("diceMode", diceMode.toString());
    params.append("username", username.toString());
    const gameConfig = {
      newPlayer: false,
      gameMode,
      rounds,
      diceMode,
      username,
    };
    await fetch(`http://localhost:1999/parties/main/${randomRoomId}`, {
      method: "POST",
      body: JSON.stringify(gameConfig),
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate(`/room/${randomRoomId}?${params}`);
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
        style={{ border: "1px solid black", borderRadius: "5px" }}
      >
        <h1
          style={{ textAlign: "center", padding: "25px 0px" }}
          className="font-bold"
        >
          HOST GAME
        </h1>
        <div
          style={{
            padding: "25px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Input
            className="w-[180px]"
            placeholder="Username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
          <Select onValueChange={(value) => setGameMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Game Mode:" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Game Mode:</SelectLabel>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Hidden">Hidden</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setDiceMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Dice Mode:" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dice Mode:</SelectLabel>
                <SelectItem value="Physical">Physical</SelectItem>
                <SelectItem value="Virtual">Virtual</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setRounds(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rounds:" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rounds:</SelectLabel>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => createGame()}>Start Game</Button>
        </div>
      </div>
    </div>
  );
}
