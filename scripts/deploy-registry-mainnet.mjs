import fs from 'fs';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import netPkg from '@stacks/network';
const { StacksMainnet } = netPkg; const network = new StacksMainnet();
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY; if (!PRIVATE_KEY) throw new Error('Missing STACKS_PRIVATE_KEY');
const FEE = BigInt(process.env.FEE||'10000');
const codeBody = fs.readFileSync('./contracts/aetheros-bounty-registry.clar','utf8');
const tx = await makeContractDeploy({ contractName:'aetheros-bounty-registry', codeBody, senderKey:PRIVATE_KEY, network, anchorMode:AnchorMode.Any, fee:FEE });
console.log('Broadcasting...'); console.log(JSON.stringify(await broadcastTransaction(tx, network), null, 2));
