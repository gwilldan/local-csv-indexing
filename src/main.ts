import { processor } from "./processor";
import { db } from "./db";
import { MUSE_ADDRESS } from "./processor";
import * as MuseABI from "./abi/muse";
import { ethers } from "ethers";

processor.run(db, async (ctx) => {
	for (let block of ctx.blocks) {
		for (let log of block.logs) {
			if (log.address !== MUSE_ADDRESS) continue;
			if (
				![
					MuseABI.events.Transfer.topic,
					MuseABI.events.Approval.topic,
				].includes(log.address)
			) {
				continue;
			}

			if (log.topics[0] === MuseABI.events.Transfer.topic) {
				const { from, to, value } = MuseABI.events.Transfer.decode(log);
				ctx.store.Transfers.write({
					blockNumber: block.header.height,
					timestamp: new Date(block.header.timestamp),
					contractAddress: log.address,
					from: from.toLowerCase(),
					to: to.toLowerCase(),
					amount: Number(ethers.formatEther(value)),
				});
			}
			if (log.topics[0] === MuseABI.events.Approval.topic) {
				const { owner, spender, value } = MuseABI.events.Approval.decode(log);
				ctx.store.Approvals.write({
					blockNumber: block.header.height,
					timestamp: new Date(block.header.timestamp),
					contractAddress: log.address,
					from: owner.toLowerCase(),
					to: spender.toLowerCase(),
					amount: Number(ethers.formatEther(value)),
				});
			}
		}
	}
});
