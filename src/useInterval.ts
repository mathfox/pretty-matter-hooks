import { useHookState } from "@rbxts/matter";

interface Storage {
	time?: number;
	expiry?: number;
}

export function useInterval(seconds: number, discriminator?: unknown): boolean {
	const storage = useHookState(discriminator) as Storage;

	const now = os.clock();

	if (storage.time === undefined) {
		storage.time = now;
		storage.expiry = now + seconds;

		return false;
	}

	if (now >= storage.expiry!) {
		storage.time = now;
		storage.expiry = now + seconds;

		return true;
	}

	return false;
}
