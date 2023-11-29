import { lookupArchive } from "@subsquid/archive-registry";
import {
	BlockHeader,
	DataHandlerContext,
	EvmBatchProcessor,
	EvmBatchProcessorFields,
	Log as _Log,
	Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as MuseABI from "./abi/muse";

export const MUSE_ADDRESS =
	"0xB6Ca7399B4F9CA56FC27cBfF44F4d2e4Eef1fc81".toLocaleLowerCase();

export const processor = new EvmBatchProcessor()
	.setDataSource({
		archive: lookupArchive("eth-mainnet"),
		chain: "https://rpc.ankr.com/eth",
	})
	.setFinalityConfirmation(75)
	.setFields({
		transaction: {
			from: true,
			value: true,
			hash: true,
		},
	})
	.setBlockRange({
		from: 11_022_769,
	})
	.addLog({
		address: [MUSE_ADDRESS],
		topic0: [
			MuseABI.events["Approval"].topic,
			MuseABI.events["Transfer"].topic,
			// Add as many topic from the contracts event as you'd like
		],
	});

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
