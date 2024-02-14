import usePartySocket from "partysocket/react";
import { useState } from "react";
import type { State } from "../../messages.d";
import countryCodeEmoji from "./country-code-emoji";

// This is a component that will connect to the partykit backend
// and display the number of connected users, and where they're from.
export default function WhosHere() {
  const [users, setUsers] = useState<State | undefined>();
  const [bankAmount, setBankAmount] = useState<number>(0);

  const socket = usePartySocket({
    // connect to the party defined by 'geo.ts'
    party: "geo",
    // this can be any name, we just picked 'index'
    room: "index",
    onMessage(evt) {
      // console.log('EVNT', evt)
      const data = JSON.parse(evt.data) as State;
      // console.log('DATA', data)
      setUsers(data);
      setBankAmount(data.bankTotal);
    },
  });

  return !users ? (
    "Connecting..."
  ) : (
    <div className="presence">
      <b>BANK: {bankAmount}</b>
      <br />
      <button
          className="m-2 p-2 border border-white flex space-x-2 hover:bg-gray-800"
          key={'number'}
          onClick={() => {
            socket.send(JSON.stringify({ add: 1 }));
          }}
      >Add 1</button>
      <br />
      <br />
      <br />
      <h2>Current Players</h2>
      <ul>
        {users?.players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      {users?.total} user{users?.total !== 1 ? "s" : ""} online. (
      {Object.entries(users?.from || {})
        .map(([from, count]) => {
          return `${count} from ${countryCodeEmoji(from)}`;
        })
        .join(", ")}
      )
    </div>
  );
}
