import usePartySocket from "partysocket/react";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import Game from '../components/game';
import type {
  LoaderFunction,
  LoaderFunctionArgs,
} from "partymix";

export const loader: LoaderFunction = async function ({
  context,
  params
}: LoaderFunctionArgs) {
  const res = await context.lobby.parties.main.get(`${params.id}`).fetch();
  const data = await res.json();

  return {data, roomId: params.id, baseUrl: context.lobby.env.BASE_URL};
};

export default function RoomParam() {
  const {data, roomId, baseUrl} = useLoaderData<typeof loader>();
  console.log('DATA', data);
  const [gameState, setGameState] = useState(data.gameState);
  
  // const [message, setMessage] = useState<string>("");
  // const [players, setPlayers] = useState<string[]>([]);
  // const [clicked, setClicked] = useState<number>(0);

  const socket = usePartySocket({
    host: baseUrl,
    room: roomId,
    onMessage(event) {
      
      const roomData = JSON.parse(event.data);
      console.log('BEING BROADCASTED', roomData.gameState)
      setGameState({...roomData.gameState});
    },
  });

  // const sendClick = () => {
  //   socket.send(JSON.stringify({ clicked: clicked + 1 }));
  //   console.log('CLICKED')
  // };

  // const sendPing = () => {
  //   try {
  //     const pingMessage = JSON.stringify({ type: "ping", username });
  //     socket.send(pingMessage);
  //   } catch (err) {
  //     console.log("ERR", err);
  //   }
  // };

  // useEffect(() => {
  //   getData(roomId);
  //   // const pingInterval = setInterval(sendPing, 5000);

  //   // return () => {
  //   //   clearInterval(pingInterval);
  //   // };
  // }, [socket]);

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
        justifyContent: "start",
      }}
    >
      <h1 className="font-bold text-xl py-8">Room ID: {roomId}</h1>
      <Game socket={socket} data={data} gameState={gameState}/>
    </div>
  );
}
