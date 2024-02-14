// import usePartySocket from "partysocket/react";
// import type { State } from "../../messages.d";
import { useParams } from '@remix-run/react';

export default function RoomParam() {
	let params = useParams();
	console.log('PARMAS', params)
	// const socket = usePartySocket({
	// 	// connect to the party defined by 'geo.ts'
	// 	party: "geo",
	// 	// this can be any name, we just picked 'index'
	// 	room: params.id,
	// 	onMessage(evt) {
	// 		  const data = JSON.parse(evt.data) as State;
	// 		 console.log('DATA', data)
	// 	},
	// });
	return (
	  <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<h1>Room ID: {params.id}</h1>
	  </div>
	);
}