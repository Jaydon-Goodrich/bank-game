import { createRequestHandler, logDevReady } from "partymix";
import * as build from "@remix-run/dev/server-build";

import type * as Party from "partykit/server";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    lobby: Party.FetchLobby;
  }
}

if (process.env.NODE_ENV === "development") {
  // trigger a reload on the remix dev server
  logDevReady(build);
}

// create a request handler for remix
const handleRequest = createRequestHandler({
  build,
  getLoadContext: (req, lobby, ctx) => {
    // use this function to expose stuff in loaders
    return { lobby };
  },
});

type GameConfig = {
  gameMode: string;
  rounds: string;
  username: string;
};

type NewPlayer = {
  newPlayer: boolean;
  username: string;
};

type Player = {
  username: string;
  score: number;
};

type GameState = {
  gameMode: "Standard" | "Hidden";
  rounds: "10" | "15" | "20";
  diceType: "Physical" | "Digital";
  players: Player[];
  round: number;
  roundScore: number;
};

// This "main" party server simply handles all regular http requests
export default class MyRemix implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = {
    gameMode: "Standard",
    rounds: "10",
    diceType: "Physical",
    players: [],
    round: 1,
    roundScore: 0,
  };
  message: string | undefined;
  players: string[] = [];
  lastPings: { username: string; lastPing: number }[] = [];
  oldPlayersStorage: string[] = [];

  static onFetch(
    request: Party.Request,
    lobby: Party.FetchLobby,
    ctx: Party.ExecutionContext
  ) {
    return handleRequest(request, lobby, ctx);
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const data: GameConfig | NewPlayer = await req.json();
      this.players.push(data.username);
      this.lastPings.push({ username: data.username, lastPing: Date.now() });
      this.room.broadcast(JSON.stringify({ players: this.players }));
      return new Response(JSON.stringify({ players: this.players }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET") {
      return new Response(JSON.stringify({ players: this.players }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  isOlderThan40Seconds(timestamp: number) {
    const fortySecondsAgo = Date.now() - 10 * 1000; // 40 seconds * 1000 ms/s
    return timestamp < fortySecondsAgo;
  }

  async onMessage(message: string) {
    const event = JSON.parse(message);
    if (event.type === "ping") {
      this.lastPings.find(
        (ping) => ping.username === event.username
      )!.lastPing = Date.now();
      const oldPing = this.lastPings.find((ping) =>
        this.isOlderThan40Seconds(ping.lastPing)
      );
      if (oldPing) {
        this.oldPlayersStorage = [oldPing.username, ...this.oldPlayersStorage];
        this.players = this.players.filter(
          (player) => player !== oldPing.username
        );
        this.lastPings = this.lastPings.filter(
          (ping) => ping.username !== oldPing.username
        );
        this.room.broadcast(JSON.stringify({ players: this.players }));
      }
    } else {
      this.message = event.message;
      this.room.broadcast(
        JSON.stringify({ clicked: event.clicked, players: this.players })
      );
    }
  }
}

MyRemix satisfies Party.Worker;
