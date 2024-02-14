// import usePartySocket from "partysocket/react";
// import { useState } from "react";
// import type { State } from "../../messages.d";
import WhosHere from "../components/whos-here";


// This is a component that will connect to the partykit backend
// and display the number of connected users, and where they're from.
export default function Game() {
//   const [users, setUsers] = useState<State | undefined>();
//   const [bankAmount, setBankAmount] = useState<number>(0);

//   const socket = usePartySocket({
//     // connect to the party defined by 'geo.ts'
//     party: "geo",
//     // this can be any name, we just picked 'index'
//     room: "index",
//     onMessage(evt) {
//       console.log('EVNT', evt)
//       const data = JSON.parse(evt.data) as State;
//       console.log('DATA', data)
//       setUsers(data);
//       setBankAmount(data.bankTotal);
//     },
//   });

  return (
    <div className="presence">
      <p>Bank Comp</p>
	  <WhosHere />
    </div>
  );
}
