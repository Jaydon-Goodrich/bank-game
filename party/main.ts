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
  bankedPlayers: Player[];
  activePlayers: Player[];
  round: number;
  roundScore: number;
  roll: number;
};

// This "main" party server simply handles all regular http requests
export default class MyRemix implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = {
    gameMode: "Standard",
    rounds: "10",
    diceType: "Physical",
    players: [{username: 'test', score: 0}, {username: 'test2', score: 0}, {username: 'test3', score: 0}],
    bankedPlayers: [],
    activePlayers: [],
    round: 1,
    roundScore: 0,
    roll: 0
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
    console.log('REQUEST COMING IN', req.method)
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
      return new Response(JSON.stringify({ players: this.players, gameState: this.gameState }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  isOlderThan40Seconds(timestamp: number) {
    const fortySecondsAgo = Date.now() - 100 * 1000;
    return timestamp < fortySecondsAgo;
  }

  async onMessage(message: string) {
    const event = JSON.parse(message);
    if (event.type === "ping") {
      // this.lastPings.find(
      //   (ping) => ping.username === event.username
      // )!.lastPing = Date.now();
      // const oldPing = this.lastPings.find((ping) =>
      //   this.isOlderThan40Seconds(ping.lastPing)
      // );
      // if (oldPing) {
      //   this.oldPlayersStorage = [oldPing.username, ...this.oldPlayersStorage];
      //   this.players = this.players.filter(
      //     (player) => player !== oldPing.username
      //   );
      //   this.lastPings = this.lastPings.filter(
      //     (ping) => ping.username !== oldPing.username
      //   );
      //   this.room.broadcast(JSON.stringify({ players: this.players }));
      // }
    }

    if(event.type === 'bankPlayers') {
      event.players.forEach((player: {username: string, score: number}) => {
        const p = this.gameState.players.find(p => p.username === player.username)!;
        p.score = this.gameState.roundScore;
        const index = this.gameState.players.indexOf(p);
        this.gameState.bankedPlayers.push(p);
        this.gameState.players.splice(index, 1);
      });
      this.room.broadcast(JSON.stringify({ gameState: this.gameState }));
    }

    if(event.type === 'addScore') {
      const roll = parseInt(event.num);
      if(this.gameState.roll < 3 && roll === 7) {
        this.gameState.roundScore += 70;
      }else if(this.gameState.roll >= 3 && roll === 0) {
        this.gameState.roundScore += this.gameState.roundScore;
      }else if(this.gameState.roll >= 3 && roll === 7) {
        this.gameState.roundScore = 0;
        this.gameState.roll = 0;
        this.gameState.round++;
        this.room.broadcast(JSON.stringify({ gameState: this.gameState }));
        return;
      }else {
        this.gameState.roundScore += roll;
      }
      this.gameState.roll++;
      this.room.broadcast(JSON.stringify({ gameState: this.gameState }));
    }
  }
}

MyRemix satisfies Party.Worker;
