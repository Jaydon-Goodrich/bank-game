import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function Host() {
	const navigate = useNavigate();
	const [gameMode, setGameMode] = useState<string>('Standard');
	const [rounds, setRounds] = useState<string>('10');

	const CreateGame = (gameMode: string, rounds: string) => {
		console.log('CLIKCED')
		const randomRoomId = Math.random().toString(36).substring(7);
		const params = new URLSearchParams();
		params.append('gameMode', gameMode.toString());
		params.append('rounds', rounds.toString());
		
		navigate(`/room/${randomRoomId}?${params}`);
	}

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<div style={{width: '30%', border: '1px solid black', borderRadius: '5px'}}>
				<h1 style={{textAlign: 'center', padding: '25px 0px'}}>HOST GAME</h1>
				<div style={{padding: '25px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'red'}}>
					<div>
						<label htmlFor="gameMode">Game Mode:</label>
						<select id="gameMode" name="gameMode" onChange={(e) => setGameMode(e.target.value)}>
							<option value="Standard">Standard</option>
							<option value="Hidden">Hidden</option>
						</select>
					</div>
					<div>
						<label htmlFor="rounds">Rounds:</label>
						<select id="rounds" name="rounds" onChange={(e) => setRounds(e.target.value)}>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
						</select>
					</div>
					<Button onClick={() => CreateGame(gameMode, rounds)}>Start Game</Button>
				</div>
			</div>
	  	</div>
	)
}