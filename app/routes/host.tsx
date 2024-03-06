import { useState } from "react";
import { useNavigate } from "@remix-run/react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
  } from "~/components/ui/select"
  import { Button } from "~/components/ui/button"

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
				<div style={{padding: '25px 0', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<Select>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Game Mode:" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Game Mode:</SelectLabel>
								<SelectItem value="Standard">Standard</SelectItem>
								<SelectItem value="Hidden">Hidden</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Rounds:" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Rounds:</SelectLabel>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="15">15</SelectItem>
								<SelectItem value="20">20</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button onClick={() => CreateGame(gameMode, rounds)}>Start Game</Button>
				</div>
			</div>
	  	</div>
	)
}