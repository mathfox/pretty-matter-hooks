import { useHookState } from "@rbxts/matter";

type Storage = {
	dtor?: Callback;
};

function cleanup(storage: Storage) {
	if (storage.dtor) storage.dtor();
}

export function useDestructor(callback: () => Callback, discriminator?: unknown) {
	const storage = useHookState(discriminator, cleanup) as Storage;

	if (!storage.dtor) {
		storage.dtor = callback();
	}
}
