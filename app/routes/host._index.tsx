import { Form, useActionData } from "@remix-run/react";
import type {ActionFunctionArgs} from "@remix-run/node";
import {json, redirect} from "partymix";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const action = async ({
  request,
  context
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const gameMode = formData.get("gameMode");
  const rounds = formData.get("rounds");
  const diceMode = formData.get("diceMode");

  const errors = {
    username: username ? null : "Username is required",
    gameMode: gameMode ? null : "Game Mode is required",
    rounds: rounds ? null : "Rounds are required",
    diceMode: diceMode ? null : "Dice Mode is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json(errors);
  }

  const randomRoomId = Math.random().toString(36).substring(2);

  const gameConfig = {
    newPlayer: false,
    gameMode,
    rounds,
    diceMode,
    username,
  };
  await fetch(`${context.lobby.env.BASE_URL}/parties/main/${randomRoomId}`, {
    method: "POST",
    body: JSON.stringify(gameConfig),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return redirect(`/room/${randomRoomId}`);
};

export default function Host() {
  const errors = useActionData<typeof action>();

  return (
    <Form method="post">
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
          {errors?.username ? (
            <em className="text-red-600">{errors.username}</em>
          ) : null}
          <Input
            type="text" 
            name="username"
            className="w-[180px]"
            placeholder="Username"
          />
          {errors?.gameMode ? (
            <em className="text-red-600">{errors.gameMode}</em>
          ) : null}
          <select name="gameMode" className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[180px]">
            <option value="">Game Mode:</option>
            <option value="Standard">Standard</option>
            <option value="Hidden">Hidden</option>
          </select>
          {errors?.diceMode ? (
            <em className="text-red-600">{errors.diceMode}</em>
          ) : null}
          <select name="diceMode" className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[180px]">
            <option value="">Dice Mode:</option>
            <option value="Physical">Physical</option>
            <option value="Virtual">Virtual</option>
          </select>
          {errors?.rounds ? (
            <em className="text-red-600">{errors.rounds}</em>
          ) : null}
          <select name="rounds" className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[180px]">
            <option value="">Rounds:</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <Button type="submit" className="mt-2">Start Game</Button>
        </div>
      </div>
    </div>
    </Form>
  );
}
