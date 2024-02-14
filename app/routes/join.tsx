import { Form } from "@remix-run/react";
import {useState} from 'react';

export default function Join() {
	const [roomId, setRoomId] = useState<string>('');
	return (
	  <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<div style={{width: '30%', border: '1px solid black', borderRadius: '5px'}}>
        	<h1 style={{textAlign: 'center', padding: '25px 0px'}}>JOIN GAME</h1>
			<Form action={`/room/${roomId}`} method="post">
				<input name="name" type="text" />
				<input name="roomId" type="text" onChange={(e) => setRoomId(e.target.value)}/>
				<button type="submit">Join Game</button>
			</Form>
		</div>
	  </div>
	);
}
  