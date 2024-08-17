import { useHookState } from "@rbxts/matter";

export function useInterval(seconds: number, discriminator?: unknown): boolean {
	const storage = useHookState(discriminator) as {
		time?: number;
		expiry?: number;
	};

	if (storage.time === undefined) {
		storage.time = os.clock();
		storage.expiry = os.clock() + seconds;
	}

	assert(storage.expiry !== undefined);

	if (storage.time >= storage.expiry) {
		storage.time = os.clock();
		storage.expiry = os.clock() + seconds;

		return true;
	}

	return false;
}
