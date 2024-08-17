import { useHookState } from "@rbxts/matter";

export function useInterval(seconds: number, discriminator?: unknown): boolean {
	const storage = useHookState(discriminator) as {
		time?: number;
		expiry?: number;
	};

	const now = os.clock();

	if (storage.time === undefined) {
		storage.time = now;
		storage.expiry = now + seconds;

		return false;
	}

	assert(storage.expiry !== undefined);

	if (now >= storage.expiry) {
		storage.time = now;
		storage.expiry = now + seconds;

		return true;
	}

	return false;
}
