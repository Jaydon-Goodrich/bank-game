import usePartySocket from "partysocket/react";
import { useState } from "react";

interface NameFormProps {
	setHasName: (hasName: boolean) => void;
}

export default function NameForm({setHasName}: NameFormProps) {
	const [name, setName] = useState<string>('');
	const socket = usePartySocket({
		party: "geo",
		room: "index"
	});

	const joinGame = (name: string) => {
		socket.send(JSON.stringify({ name }));
		setHasName(true);
	}

	return (
		<div className="presence">
			<p>Welcome to the Bank Game</p>
			<input placeholder="Plz enter your name:" onChange={(e) => setName(e.target.value)} value={name}/>
			<button onClick={() => joinGame(name)}>Join Game</button>
		</div>
	);
}
	