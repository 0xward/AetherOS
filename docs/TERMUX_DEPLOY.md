# AetherOS Deploy via Termux

## 0) Prereqs (run inside Termux HOME, not /storage/emulated/0)
```bash
pkg update && pkg install nodejs-lts git -y
cp -r /storage/emulated/0/AetherOS-main ~/AetherOS-main && cd ~/AetherOS-main
npm install @stacks/transactions@6 @stacks/network@6 --no-audit --no-fund
```
Working in ~ (native FS) avoids the EACCES symlink error on Android shared storage.

## 1) Set your key (NEVER share it)
```bash
export STACKS_PRIVATE_KEY='your_private_key'
```

## 2) Deploy contracts (already deployed on mainnet — re-deploy only if needed)
```bash
node scripts/deploy-sbt-mainnet.mjs
node scripts/deploy-registry-mainnet.mjs            # auto fee
FEE=10000 node scripts/deploy-registry-mainnet.mjs  # manual 0.01 STX
```
Tip: if a tx is stuck in mempool, re-run with a higher FEE (same nonce) — only one mines, no double spend.

## 3) Deployed mainnet contracts
- aetheros-certificate-sbt  · tx 0x8690f75d7acd77e238371aa8315b41a13d55bebb05c97271bcb2433e397f51c1
- aetheros-bounty-registry  · tx 0xbe74be438bb6f76815839e8bdac3420c9d685b9c9f2e62e363cd768af8e59120
Deployer: SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF

## 4) Push to GitHub + Vercel
```bash
git init && git add . && git commit -m "feat: bounties, SBT badges, Gaia CRM, AI outreach"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AetherOS.git
git push -u origin main
```
Import the repo in Vercel and set env vars from .env.example (GROQ_API_KEY etc.).
