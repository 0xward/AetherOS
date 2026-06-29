import fs from 'fs';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import netPkg from '@stacks/network';
const { StacksMainnet } = netPkg; const network = new StacksMainnet();
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY; if (!PRIVATE_KEY) throw new Error('Missing STACKS_PRIVATE_KEY');
const codeBody = fs.readFileSync('./contracts/aetheros-certificate-sbt.clar','utf8');
const tx = await makeContractDeploy({ contractName:'aetheros-certificate-sbt', codeBody, senderKey:PRIVATE_KEY, network, anchorMode:AnchorMode.Any, fee: BigInt(process.env.FEE||'10000') });
console.log('Broadcasting...'); console.log(JSON.stringify(await broadcastTransaction(tx, network), null, 2));
