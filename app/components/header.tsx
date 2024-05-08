import {Link} from '@remix-run/react';

export function Header() {
	return (
		<div className="flex width-full justify-center mt-2">
          <img src="/dice.svg" alt="A six sided die" width={25} />
          <Link to="/">
            <h2 className="text-center font-bold text-lg px-2">Bank Game</h2>
          </Link>
          <img
            src="/dice.svg"
            alt="A six sided die"
            width={25}
            style={{ transform: "rotate(90deg)" }}
          />
        </div>
	)
}