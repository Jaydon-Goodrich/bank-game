// We use this 'party' to get and broadcast presence information
// from all connected users. We'll use this to show how many people
// are connected to the room, and where they're from.

import type { State } from "../messages";

import type * as Party from "partykit/server";
type Poll = {
  title: string;
  options: string[];
  votes?: number[];
};
export default class MyRemix implements Party.Server {
  // eslint-disable-next-line no-useless-constructor
  constructor(public room: Party.Room) {}

  // we'll store the state in memory
  state: State = {
    bankTotal: 0,
    total: 0,
    from: {},
    players: [],
  };
  // let's opt in to hibernation mode, for much higher concurrency
  // like, 1000s of people in a room 🤯
  // This has tradeoffs for the developer, like needing to hydrate/rehydrate
  // state on start, so be careful!
  static options = {
    hibernate: false,
  };

  onMessage(message: string, sender: Party.Connection) {
    this.state = {
      bankTotal: this.state.bankTotal + 1,
      total: this.state.total,
      from: this.state.from,
      players: this.state.players,
    };
    this.room.broadcast(JSON.stringify(this.state));
  }

  // This is called every time a new room is made
  // since we're using hibernation mode, we should
  // "rehydrate" this.state here from all connections
  onStart(): void | Promise<void> {
    console.log("CREATING NEW ROOM");
    for (const connection of this.room.getConnections<{ from: string }>()) {
      const from = connection.state!.from;
      this.state = {
        bankTotal: this.state.bankTotal,
        total: this.state.total + 1,
        from: {
          ...this.state.from,
          [from]: (this.state.from[from] ?? 0) + 1,
        },
        players: this.state.players,
      };
    }
  }

  // This is called every time a new connection is made
  async onConnect(
    connection: Party.Connection<{ from: string; userId: number }>,
    ctx: Party.ConnectionContext
  ): Promise<void> {
    console.log("CONNECTION ON START", connection.state);
    const userId = Math.floor(Math.random() * 1000000);
    const from = (ctx.request.cf?.country ?? "unknown") as string;
    // and update our state
    this.state = {
      bankTotal: this.state.bankTotal,
      total: this.state.total + 1,
      from: {
        ...this.state.from,
        [from]: (this.state.from[from] ?? 0) + 1,
      },
      players: [...this.state.players, userId],
    };
    // let's also store where we're from on the connection
    // so we can hydrate state on start, as well as reference it on close
    connection.setState({ from, userId });
    // finally, let's broadcast the new state to all connections
    this.room.broadcast(JSON.stringify(this.state));
  }

  // This is called every time a connection is closed
  async onClose(
    connection: Party.Connection<{ from: string; userId: number }>
  ): Promise<void> {
    // let's update our state
    // first let's read the country from the connection state
    console.log("CONNECTION ON CLOSE", connection.state);
    const userId = connection.state!.userId;
    const playerIndex = this.state.players.indexOf(userId);
    const from = connection.state!.from;
    // and update our state
    this.state = {
      bankTotal: this.state.bankTotal,
      total: this.state.total - 1,
      from: {
        ...this.state.from,
        [from]: (this.state.from[from] ?? 0) - 1,
      },
      players: this.state.players.splice(playerIndex, 1),
    };
    // finally, let's broadcast the new state to all connections
    this.room.broadcast(JSON.stringify(this.state));
  }

  async onRequest(req: Party.Request) {
    console.log("HERE", req);
    if (req.method === "POST") {
      const poll = (await req.json()) as Poll;
      return new Response("sup", { status: 200 });
      // this.poll = { ...poll, votes: poll.options.map(() => 0) };
    }

    // if (this.poll) {
    //   return new Response(JSON.stringify(this.poll), {
    //     status: 200,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    return new Response(JSON.stringify({ data: "sup" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // return new Response("Not found", { status: 404 });
  }

  // This is called when a connection has an error
  async onError(
    connection: Party.Connection<{ from: string; userId: number }>,
    err: Error
  ): Promise<void> {
    // let's log the error
    console.error(err);
    // and close the connection
    await this.onClose(connection);
  }
}

MyRemix satisfies Party.Worker;
