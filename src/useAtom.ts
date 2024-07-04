import { type Molecule, subscribe } from "@rbxts/charm";
import { useDestructor } from "./useDestructor";
import { useState } from "./useState";

export function useAtom<T>(molecule: Molecule<T>, discriminator?: unknown) {
	const [state, setState] = useState(molecule, discriminator);

	useDestructor(() => {
		return subscribe(molecule, setState);
	}, discriminator);

	return state;
}
