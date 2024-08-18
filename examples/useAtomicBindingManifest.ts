import { useAtomicBindingManifest } from "../src";

interface CustomWorkspace extends Instance {
	someModel: Model & {
		child1: Folder;
	};
}

const root = {} as CustomWorkspace;

const [ready, instances] = useAtomicBindingManifest(root, {
	child: "someModel/child1",
});

if (ready) {
	const { child } = instances;
}
