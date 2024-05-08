import { useState } from "react";
// import type { State } from "../../messages.d";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Checkbox } from "~/components/ui/checkbox";

export default function Game({data, socket, gameState}: any) {
  const [randomNumbers, setRandomNumbers] = useState<number[]>([1, 5]);
  const [totalRoll, setTotalRoll] = useState<number>(0);
  
  const generateRandomNumbers = async () => {
    let randomNums: number[] = [];
    for (let i = 0; i < 5; i++) {
      randomNums[0] = Math.floor(Math.random() * 6) + 1;
      randomNums[1] = Math.floor(Math.random() * 6) + 1;
      setRandomNumbers([randomNums[0], randomNums[1]]);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setTotalRoll(randomNums[0] + randomNums[1]);
  };

  const addScore = (num: string) => {
    if (num === 'Doubles') {
      num = '0';
    }
    socket.send(JSON.stringify({type: 'addScore', num}))
  };

  const bankPlayers = () => {
    const players = data.gameState.players.filter((player: {username: string, score: number}) => {
      return document.getElementById(player.username)?.getAttribute('aria-checked') === 'true';
    });

    console.log('players', players)
    socket.send(JSON.stringify({type: 'bankPlayers', players}));
  }

  return (
    <div className="flex justify-center flex-col w-[80%]">
      <div className="flex justify-center items-center flex-col pb-10">
        {data.gameState.players.map((player: {username: string, score: number}) => {
          return (
            <div key={player.username} className="flex justify-between w-[50%]">
              <span>{player.username}</span>
              <span>{player.score}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col">
        <span>Round</span>
        <span>{`${gameState.round}/${gameState.rounds}`}</span>
      </div>
      <div className="flex justify-center items-center flex-col py-5">
        <span className="text-2xl">{gameState.roundScore}</span>
        <span>Round Total</span>
      </div>
      <div className="flex flex-col">
        <span>Roll</span>
        <span>{gameState.roll}</span>
      </div>
      {data.gameState.gameMode === 'Standard' ? (
        <div className="flex w-[100%] justify-evenly">
          <Drawer>
            <DrawerTrigger asChild>
              <Button>Roll</Button>
            </DrawerTrigger>
            <DrawerContent>
              {data.gameState.diceType === 'Physical' ? (
                <>
                  <DrawerHeader>
                    <DrawerTitle className="text-center">
                      Player 1's Turn
                    </DrawerTitle>
                  </DrawerHeader>
                  <DrawerFooter className="flex gap-4 flex-row flex-wrap justify-center">
                    {[
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                      "10",
                      "11",
                      "12",
                      "Doubles",
                    ].map((num: string) => {
                      return (
                        <Button disabled={num === 'Doubles' && gameState.roll < 3} key={num} className="w-[25%]" onClick={() => addScore(num)}>
                          {num}
                        </Button>
                      );
                    })}
                  </DrawerFooter>
                </>
              ) : (
                <>
                  <DrawerHeader>
                    <DrawerTitle className="text-center">
                      Player 1's Turn
                    </DrawerTitle>
                    <div className="text-center">Total Roll: {totalRoll}</div>
                  </DrawerHeader>
                  <DrawerFooter className="flex flex-col items-center justify-center">
                    <div className="flex gap-4">
                      <div
                        className="flex justify-center items-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          border: "solid 1px black",
                        }}
                      >
                        {randomNumbers[0]}
                      </div>
                      <div
                        className="flex justify-center items-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          border: "solid 1px black",
                        }}
                      >
                        {randomNumbers[1]}
                      </div>
                    </div>
                    <Button
                      className="w-[25%]"
                      onClick={() => generateRandomNumbers()}
                    >
                      Roll
                    </Button>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger asChild>
              <Button>Bank</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bank Score?</DrawerTitle>
              </DrawerHeader>
              <DrawerFooter>
                {data.gameState.players.map((player: {username: string, score: number}) => {
                  return (
                    <div key={player.username + player.score} className="items-top flex space-x-2">
                      <Checkbox id={player.username} />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={player.username}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {player.username}
                        </label>
                      </div>
                    </div>
                  );
                }
                )}
                <Button onClick={() => bankPlayers()}>Done</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        <Button className="mt-8">Bank Score</Button>
      )}
    </div>
  );
}
