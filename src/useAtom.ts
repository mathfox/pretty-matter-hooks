import { type Molecule, subscribe } from "@rbxts/amulet";
import { useDestructor } from "./useDestructor";
import { useState } from "./useState";

export function useAtom<TValue>(molecule: Molecule<TValue>, discriminator?: unknown): TValue {
	const [state, setState] = useState(molecule, discriminator);

	useDestructor(
		() => {
			return subscribe(molecule, (newState) => {
				setState(newState);
			});
		},
		[],
		discriminator,
	);

	return state;
}
