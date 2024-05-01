import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "partymix";
// import { Link } from "@remix-run/react"
import { useNavigate } from "@remix-run/react";

import { Button } from "~/components/ui/button";
// import Game from "../components/game";
// import NameForm from "../components/nameForm";
// import { useState } from "react";

declare const PARTYKIT_HOST: string;

export const meta: MetaFunction = () => {
  return [
    { title: "Bank Game" },
    { name: "description", content: "Play the classic dice game, Bank!" },
  ];
};

export const loader: LoaderFunction = async function ({
  context,
}: LoaderFunctionArgs) {
  // You can use context.lobby to read vars, communicate with parties,
  // read from ai models or the vector db, and more.
  //
  // See https://docs.partykit.io/reference/partyserver-api/#partyfetchlobby
  // for more info.
  return Response.json({ partykitHost: PARTYKIT_HOST });
};

export default function Index() {
  const navigate = useNavigate();

  // const [hasName, setHasName] = useState<boolean>(false);
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
        style={{ width: "30%", border: "1px solid black", borderRadius: "5px" }}
      >
        <h1
          className="font-bold text-xl"
          style={{ textAlign: "center", padding: "25px 0px" }}
        >
          BANK GAME
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "25px 0px",
          }}
        >
          <img src="/dice.svg" alt="A six sided die" width={50} />
          <img
            src="/dice.svg"
            alt="A six sided die"
            width={50}
            style={{ transform: "rotate(90deg)" }}
          />
        </div>
        <div
          style={{
            padding: "25px 0px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <Button
            onClick={() => {
              navigate("/join");
            }}
          >
            JOIN GAME
          </Button>
          <Button
            onClick={() => {
              navigate("/host");
            }}
          >
            HOST GAME
          </Button>
        </div>
      </div>
      {/* {hasName ? <Game/> : <NameForm setHasName={setHasName}/>} */}
    </div>
  );
}
