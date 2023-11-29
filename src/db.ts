import { Database, LocalDest } from "@subsquid/file-store";
import { Transfers } from "./tables";

export const db = new Database({
	tables: {
		Transfers,
	},
	dest: new LocalDest("./indexed_data"),
	chunkSizeMb: 100,
	syncIntervalBlocks: 10000,
});
