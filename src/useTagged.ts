import { CollectionService } from "@rbxts/services";
import { useEvent, useHookState } from "@rbxts/matter";
import { fromArray } from "@rbxts/phantom/src/Set";

type Storage<T extends Instance> = {
	value?: {
		instances: Set<T>;
		tagged: Tagged<T>;
	};
};

export interface Tagged<T extends Instance = Instance> {
	getInstances: () => Array<T>;
}

export function useTagged<T extends Instance = Instance>(
	tag: string,
	discriminator?: unknown,
): Tagged<T> {
	const storage = useHookState(discriminator) as Storage<T>;

	if (storage.value === undefined) {
		const instances = fromArray(CollectionService.GetTagged(tag)) as Set<T>;

		storage.value = {
			instances,
			tagged: {
				getInstances: () => {
					const keys = new Array<T>();

					for (const instance of instances) {
						keys.push(instance);
					}

					return keys;
				},
			},
		};
	}

	for (const [_, instance] of useEvent(
		CollectionService,
		CollectionService.GetInstanceAddedSignal(tag),
	)) {
		storage.value.instances.add(instance as T);
	}

	for (const [_, instance] of useEvent(
		CollectionService,
		CollectionService.GetInstanceRemovedSignal(tag),
	)) {
		storage.value.instances.delete(instance as T);
	}

	return storage.value.tagged;
}
