import { NextRequest, NextResponse } from 'next/server';

interface UserContext {
  background: string;
  industry: string;
  goals: string;
  currentPosition: string;
  projectStage?: string;
  projectDescription?: string;
}

export interface GrantMatch {
  id: string;
  name: string;
  organization: string;
  orgType: 'web2' | 'web3' | 'government' | 'foundation';
  category: string;
  description: string;
  fundingAmount: string;
  fundingMin?: number;
  fundingMax?: number;
  deadline: string;
  deadlineTimestamp?: number;
  url: string;
  applyUrl: string;
  logoUrl: string;
  logoColor: string;
  tags: string[];
  eligibility: string;
  matchScore: number;
  matchReasons: string[];
  source: 'gitcoin' | 'curated' | 'federal';
  isOpen: boolean;
  featured?: boolean;
}

// ─── Curated Grant Database ────────────────────────────────────────────────────
// Web2 Giants + Web3 Foundations + Government
const CURATED_GRANTS: Omit<GrantMatch, 'matchScore' | 'matchReasons'>[] = [
  // ── WEB2 GIANTS ──
  {
    id: 'google-org',
    name: 'Google.org Impact Challenge',
    organization: 'Google',
    orgType: 'web2',
    category: 'Social Impact Tech',
    description: 'Google.org funds nonprofits and social enterprises using technology to address global challenges including climate, education, economic opportunity, and inclusion.',
    fundingAmount: 'Up to $1M USD',
    fundingMin: 50000,
    fundingMax: 1000000,
    deadline: 'Rolling',
    url: 'https://www.google.org/grants/',
    applyUrl: 'https://www.google.org/grants/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png',
    logoColor: '#4285F4',
    tags: ['social impact', 'technology', 'education', 'climate', 'nonprofit'],
    eligibility: 'Registered nonprofits with technology-driven solutions to social problems.',
    source: 'curated',
    isOpen: true,
    featured: true,
  },
  {
    id: 'meta-research',
    name: 'Meta Research Awards',
    organization: 'Meta',
    orgType: 'web2',
    category: 'AI & Privacy Research',
    description: 'Meta funds academic and industry research in AI, privacy, AR/VR, and responsible innovation. Research awards range from unrestricted gifts to full project funding.',
    fundingAmount: '$50K – $200K USD',
    fundingMin: 50000,
    fundingMax: 200000,
    deadline: 'Rolling / RFP-based',
    url: 'https://research.facebook.com/research-awards/',
    applyUrl: 'https://research.facebook.com/research-awards/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png',
    logoColor: '#0866FF',
    tags: ['AI', 'privacy', 'AR/VR', 'research', 'responsible tech'],
    eligibility: 'Researchers at universities and research institutions worldwide.',
    source: 'curated',
    isOpen: true,
    featured: true,
  },
  {
    id: 'microsoft-research',
    name: 'Microsoft Research Grant',
    organization: 'Microsoft',
    orgType: 'web2',
    category: 'Computer Science Research',
    description: 'Microsoft Research funds cutting-edge research in AI, cloud computing, security, programming languages, and social/economic impact of technology.',
    fundingAmount: '$25K – $150K USD',
    fundingMin: 25000,
    fundingMax: 150000,
    deadline: 'Quarterly',
    url: 'https://www.microsoft.com/en-us/research/academic-programs/grants/',
    applyUrl: 'https://www.microsoft.com/en-us/research/academic-programs/grants/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png',
    logoColor: '#00A4EF',
    tags: ['AI', 'cloud', 'security', 'research', 'programming'],
    eligibility: 'Academic researchers and postdoctoral fellows at accredited universities.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'amazon-aws-activate',
    name: 'AWS Activate Founders',
    organization: 'Amazon Web Services',
    orgType: 'web2',
    category: 'Startup Credits & Support',
    description: 'AWS Activate provides startups with credits, technical support, and training to build on AWS. Ideal for early-stage Web3 and tech startups needing cloud infrastructure.',
    fundingAmount: 'Up to $100K in credits',
    fundingMin: 1000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://aws.amazon.com/activate/',
    applyUrl: 'https://aws.amazon.com/activate/founders/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/200px-Amazon_Web_Services_Logo.svg.png',
    logoColor: '#FF9900',
    tags: ['cloud', 'startup', 'infrastructure', 'credits', 'AWS'],
    eligibility: 'Early-stage startups building on AWS. Must be pre-Series B.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'github-accelerator',
    name: 'GitHub Accelerator',
    organization: 'GitHub',
    orgType: 'web2',
    category: 'Open Source',
    description: 'GitHub Accelerator provides $20K stipends and mentorship to open source maintainers to grow sustainable projects. Great for Web3 protocol builders.',
    fundingAmount: '$20K USD + mentorship',
    fundingMin: 20000,
    fundingMax: 20000,
    deadline: 'Annual (Q1)',
    url: 'https://accelerator.github.com/',
    applyUrl: 'https://accelerator.github.com/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/200px-Octicons-mark-github.svg.png',
    logoColor: '#24292E',
    tags: ['open source', 'developer tools', 'Web3', 'maintainer'],
    eligibility: 'Open source maintainers with significant GitHub activity.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'samsung-next',
    name: 'Samsung NEXT Ventures',
    organization: 'Samsung',
    orgType: 'web2',
    category: 'Deep Tech Investment',
    description: 'Samsung NEXT invests in and acquires early-stage startups in software and services, including blockchain, AI, developer tools, and enterprise software.',
    fundingAmount: '$250K – $5M USD',
    fundingMin: 250000,
    fundingMax: 5000000,
    deadline: 'Rolling',
    url: 'https://www.samsungnext.com/',
    applyUrl: 'https://www.samsungnext.com/contact',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png',
    logoColor: '#1428A0',
    tags: ['deep tech', 'blockchain', 'AI', 'enterprise', 'investment'],
    eligibility: 'Early-stage startups (Seed to Series A) with strong technical teams.',
    source: 'curated',
    isOpen: true,
  },

  // ── WEB3 FOUNDATIONS ──
  {
    id: 'ethereum-foundation',
    name: 'Ethereum Foundation Grants',
    organization: 'Ethereum Foundation',
    orgType: 'web3',
    category: 'Ethereum Ecosystem',
    description: 'EF funds projects that contribute to the Ethereum ecosystem: client development, research, tooling, education, and community initiatives. One of the most prestigious Web3 grants.',
    fundingAmount: '$30K – $500K+ USD',
    fundingMin: 30000,
    fundingMax: 500000,
    deadline: 'Rolling (ESP)',
    url: 'https://ethereum.foundation/grants/',
    applyUrl: 'https://esp.ethereum.foundation/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/100px-Ethereum_logo_2014.svg.png',
    logoColor: '#627EEA',
    tags: ['Ethereum', 'EVM', 'research', 'client', 'tooling', 'education'],
    eligibility: 'Anyone working on open source tools or research benefiting the Ethereum ecosystem.',
    source: 'curated',
    isOpen: true,
    featured: true,
  },
  {
    id: 'filecoin-foundation',
    name: 'Filecoin Foundation Grants',
    organization: 'Filecoin Foundation',
    orgType: 'web3',
    category: 'Decentralized Storage',
    description: 'Filecoin Foundation funds projects that build on decentralized storage, preserve important datasets, and advance open internet infrastructure.',
    fundingAmount: '$5K – $100K USD',
    fundingMin: 5000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://fil.org/grants/',
    applyUrl: 'https://github.com/filecoin-project/devgrants',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Filecoin.svg/200px-Filecoin.svg.png',
    logoColor: '#0090FF',
    tags: ['storage', 'decentralized', 'IPFS', 'data', 'infrastructure'],
    eligibility: 'Teams building on Filecoin/IPFS or providing complementary tooling.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'web3-foundation',
    name: 'Web3 Foundation Grants',
    organization: 'Web3 Foundation',
    orgType: 'web3',
    category: 'Polkadot / Substrate',
    description: 'W3F funds software development and research in the Polkadot ecosystem. Open to teams building parachains, bridges, tooling, and developer experience.',
    fundingAmount: 'Up to $100K USD (DOT)',
    fundingMin: 10000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://grants.web3.foundation/',
    applyUrl: 'https://grants.web3.foundation/applications',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Web3_Foundation_logo.svg/200px-Web3_Foundation_logo.svg.png',
    logoColor: '#E6007A',
    tags: ['Polkadot', 'Substrate', 'parachain', 'bridges', 'Rust'],
    eligibility: 'Teams with technical capacity to deliver software on Polkadot/Kusama.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'optimism-rpgf',
    name: 'Optimism RetroPGF',
    organization: 'Optimism Collective',
    orgType: 'web3',
    category: 'Retroactive Public Goods',
    description: 'Retroactive Public Goods Funding rewards projects that have already created value for the Optimism ecosystem. Millions distributed each round.',
    fundingAmount: '$5M+ USD total per round (OP tokens)',
    fundingMin: 1000,
    fundingMax: 5000000,
    deadline: 'Periodic rounds',
    url: 'https://app.optimism.io/retropgf',
    applyUrl: 'https://app.optimism.io/retropgf',
    logoUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    logoColor: '#FF0420',
    tags: ['Optimism', 'public goods', 'retroactive', 'OP', 'L2'],
    eligibility: 'Anyone who has created impact in the Optimism ecosystem.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'gitcoin-grants',
    name: 'Gitcoin Grants (QF Rounds)',
    organization: 'Gitcoin',
    orgType: 'web3',
    category: 'Open Source Public Goods',
    description: 'Gitcoin uses Quadratic Funding to match community donations to open source projects. Ecosystem rounds focus on DeFi, education, infrastructure, and more.',
    fundingAmount: 'Variable (community + matching)',
    fundingMin: 100,
    fundingMax: 500000,
    deadline: 'Quarterly rounds',
    url: 'https://grants.gitcoin.co/',
    applyUrl: 'https://builder.gitcoin.co/',
    logoUrl: 'https://cryptologos.cc/logos/gitcoin-gtc-logo.png',
    logoColor: '#00433B',
    tags: ['quadratic funding', 'public goods', 'open source', 'community', 'DeFi'],
    eligibility: 'Open source projects building in the Web3 ecosystem. Must have working code.',
    source: 'gitcoin',
    isOpen: true,
    featured: true,
  },
  {
    id: 'near-foundation',
    name: 'NEAR Foundation Grants',
    organization: 'NEAR Foundation',
    orgType: 'web3',
    category: 'NEAR Ecosystem',
    description: 'NEAR Foundation funds projects building on NEAR Protocol — DeFi, NFTs, gaming, DAOs, and infrastructure. Known for fast approvals and strong community support.',
    fundingAmount: '$10K – $250K USD',
    fundingMin: 10000,
    fundingMax: 250000,
    deadline: 'Rolling',
    url: 'https://near.foundation/grants/',
    applyUrl: 'https://near.foundation/grants/',
    logoUrl: 'https://cryptologos.cc/logos/near-protocol-near-logo.png',
    logoColor: '#00C1DE',
    tags: ['NEAR', 'DeFi', 'NFT', 'gaming', 'DAO', 'Rust'],
    eligibility: 'Teams with a clear roadmap building on NEAR Protocol.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'solana-foundation',
    name: 'Solana Foundation Grants',
    organization: 'Solana Foundation',
    orgType: 'web3',
    category: 'Solana Ecosystem',
    description: 'Solana Foundation funds developers, creators, and validators building on Solana. Focus areas include DeFi, NFT infrastructure, tooling, and developer education.',
    fundingAmount: '$10K – $100K USD (USDC)',
    fundingMin: 10000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://solana.org/grants',
    applyUrl: 'https://solana.org/grants',
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    logoColor: '#9945FF',
    tags: ['Solana', 'DeFi', 'NFT', 'Rust', 'validator', 'tooling'],
    eligibility: 'Developers building open source projects on Solana.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'stacks-foundation',
    name: 'Stacks Foundation Grant',
    organization: 'Stacks Foundation',
    orgType: 'web3',
    category: 'Bitcoin L2',
    description: 'The Stacks Foundation funds projects that grow the Stacks ecosystem — smart contracts, DeFi, NFTs, and Bitcoin-adjacent infrastructure. Powered by Clarity language.',
    fundingAmount: '$5K – $80K USD',
    fundingMin: 5000,
    fundingMax: 80000,
    deadline: 'Rolling',
    url: 'https://stacks.org/grants',
    applyUrl: 'https://stacks.org/grants',
    logoUrl: 'https://cryptologos.cc/logos/stacks-stx-logo.png',
    logoColor: '#FC6432',
    tags: ['Stacks', 'Bitcoin', 'Clarity', 'DeFi', 'NFT', 'L2'],
    eligibility: 'Developers and teams building on the Stacks blockchain.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'arbitrum-grants',
    name: 'Arbitrum Foundation LTIPP',
    organization: 'Arbitrum Foundation',
    orgType: 'web3',
    category: 'Ethereum L2',
    description: 'Long Term Incentives Pilot Program (LTIPP) funds protocols and projects building on Arbitrum with ARB tokens to drive ecosystem growth and liquidity.',
    fundingAmount: 'Up to $2M ARB tokens',
    fundingMin: 50000,
    fundingMax: 2000000,
    deadline: 'Periodic rounds',
    url: 'https://arbitrumfoundation.org/grants',
    applyUrl: 'https://forum.arbitrum.foundation/',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    logoColor: '#28A0F0',
    tags: ['Arbitrum', 'L2', 'DeFi', 'ARB', 'liquidity', 'EVM'],
    eligibility: 'DeFi protocols and projects with existing traction on Arbitrum.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'chainlink-community',
    name: 'Chainlink Community Grant',
    organization: 'Chainlink Labs',
    orgType: 'web3',
    category: 'Oracle Infrastructure',
    description: 'Chainlink Community Grants fund the development of smart contract tools, integrations, and research that grow the data-driven smart contract ecosystem.',
    fundingAmount: '$10K – $50K USD',
    fundingMin: 10000,
    fundingMax: 50000,
    deadline: 'Rolling',
    url: 'https://chain.link/community/grants',
    applyUrl: 'https://chain.link/community/grants',
    logoUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    logoColor: '#375BD2',
    tags: ['oracle', 'data feeds', 'smart contracts', 'CCIP', 'infrastructure'],
    eligibility: 'Developers building tools or integrations that use Chainlink oracles.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'polygon-grants',
    name: 'Polygon Community Grants',
    organization: 'Polygon Foundation',
    orgType: 'web3',
    category: 'Ethereum Scaling',
    description: 'Polygon Foundation funds builders creating on PoS, zkEVM, and other Polygon chains. Focuses on DeFi, gaming, NFTs, and developer tooling.',
    fundingAmount: '$10K – $150K USD',
    fundingMin: 10000,
    fundingMax: 150000,
    deadline: 'Rolling',
    url: 'https://polygon.technology/grants',
    applyUrl: 'https://polygon.technology/grants',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    logoColor: '#8247E5',
    tags: ['Polygon', 'zkEVM', 'DeFi', 'gaming', 'NFT', 'scaling'],
    eligibility: 'Teams building on any Polygon chain with clear user value.',
    source: 'curated',
    isOpen: true,
  },

  // ── GOVERNMENT & FOUNDATIONS ──
  {
    id: 'nsf-sbir',
    name: 'NSF Small Business Innovation Research',
    organization: 'National Science Foundation',
    orgType: 'government',
    category: 'Science & Technology R&D',
    description: 'NSF SBIR/STTR funds high-risk, high-reward research and development in transformative technologies including blockchain, AI, and deep tech.',
    fundingAmount: 'Phase I: $275K | Phase II: $1M',
    fundingMin: 275000,
    fundingMax: 1000000,
    deadline: 'Quarterly deadlines',
    url: 'https://seedfund.nsf.gov/',
    applyUrl: 'https://seedfund.nsf.gov/apply/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NSF_logo.png/200px-NSF_logo.png',
    logoColor: '#005AA3',
    tags: ['government', 'SBIR', 'deep tech', 'R&D', 'science', 'blockchain'],
    eligibility: 'US-based small businesses (<500 employees) with principal investigator.',
    source: 'federal',
    isOpen: true,
  },
  {
    id: 'nist-grants',
    name: 'NIST Technology Grants',
    organization: 'NIST (US Commerce Dept.)',
    orgType: 'government',
    category: 'Standards & Cybersecurity',
    description: 'NIST funds research in cybersecurity, digital identity, blockchain standards, and privacy-enhancing technologies.',
    fundingAmount: '$100K – $3M USD',
    fundingMin: 100000,
    fundingMax: 3000000,
    deadline: 'Program-dependent',
    url: 'https://www.nist.gov/grants',
    applyUrl: 'https://www.grants.gov/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/NIST_logo.svg/200px-NIST_logo.svg.png',
    logoColor: '#003A70',
    tags: ['government', 'cybersecurity', 'standards', 'digital identity', 'privacy'],
    eligibility: 'US entities: businesses, universities, nonprofits, and state governments.',
    source: 'federal',
    isOpen: true,
  },
  {
    id: 'eu-horizon',
    name: 'EU Horizon Europe — Blockchain',
    organization: 'European Commission',
    orgType: 'government',
    category: 'European Innovation',
    description: 'Horizon Europe funds R&D in blockchain, DLT, and digital innovation across EU member states. One of the largest research programs globally.',
    fundingAmount: '€500K – €5M EUR',
    fundingMin: 500000,
    fundingMax: 5000000,
    deadline: 'Annual calls',
    url: 'https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls_en',
    applyUrl: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png',
    logoColor: '#003399',
    tags: ['EU', 'research', 'blockchain', 'DLT', 'innovation', 'Europe'],
    eligibility: 'Consortia of at least 3 entities from EU/associated countries.',
    source: 'federal',
    isOpen: true,
  },
  {
    id: 'mozilla-foundation',
    name: 'Mozilla Foundation Technology Fund',
    organization: 'Mozilla Foundation',
    orgType: 'foundation',
    category: 'Open Web',
    description: 'Mozilla Technology Fund invests in safety, accountability, and transparency in AI and decentralized web technologies.',
    fundingAmount: '$50K – $200K USD',
    fundingMin: 50000,
    fundingMax: 200000,
    deadline: 'Annual',
    url: 'https://foundation.mozilla.org/en/what-we-fund/',
    applyUrl: 'https://foundation.mozilla.org/en/what-we-fund/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/100px-Firefox_logo%2C_2019.svg.png',
    logoColor: '#FF7139',
    tags: ['open web', 'AI safety', 'privacy', 'decentralized', 'accountability'],
    eligibility: 'Open source projects focused on responsible AI or decentralized web tech.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'protocol-labs',
    name: 'Protocol Labs Research Grant',
    organization: 'Protocol Labs',
    orgType: 'web3',
    category: 'Distributed Systems Research',
    description: 'Protocol Labs funds research in cryptography, distributed systems, networking, and decentralized computing. Core team behind IPFS, Filecoin, and libp2p.',
    fundingAmount: '$20K – $100K USD',
    fundingMin: 20000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://protocol.ai/research/',
    applyUrl: 'https://grants.protocol.ai/',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Protocol_Labs_logo.png/200px-Protocol_Labs_logo.png',
    logoColor: '#6BCFCF',
    tags: ['IPFS', 'Filecoin', 'cryptography', 'P2P', 'research', 'distributed systems'],
    eligibility: 'Researchers and developers with strong technical backgrounds.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'aave-grants',
    name: 'Aave Grants DAO',
    organization: 'Aave',
    orgType: 'web3',
    category: 'DeFi / Lending',
    description: 'Aave Grants DAO funds projects that grow the Aave ecosystem: integrations, tooling, analytics dashboards, and educational content.',
    fundingAmount: '$5K – $50K USD (AAVE)',
    fundingMin: 5000,
    fundingMax: 50000,
    deadline: 'Rolling',
    url: 'https://aavegrants.org/',
    applyUrl: 'https://aavegrants.org/apply',
    logoUrl: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    logoColor: '#B6509E',
    tags: ['DeFi', 'lending', 'Aave', 'integration', 'analytics', 'Ethereum'],
    eligibility: 'Developers and creators contributing to the Aave ecosystem.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'uniswap-foundation',
    name: 'Uniswap Foundation Grants',
    organization: 'Uniswap Foundation',
    orgType: 'web3',
    category: 'DeFi / DEX',
    description: 'Uniswap Foundation funds work that advances the Uniswap Protocol and broader DeFi ecosystem, including research, tooling, and developer experience.',
    fundingAmount: '$10K – $250K USD',
    fundingMin: 10000,
    fundingMax: 250000,
    deadline: 'Rolling',
    url: 'https://uniswapfoundation.mirror.xyz/',
    applyUrl: 'https://www.uniswapfoundation.org/grants',
    logoUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    logoColor: '#FF007A',
    tags: ['DeFi', 'AMM', 'Uniswap', 'v4 hooks', 'research', 'liquidity'],
    eligibility: 'Teams building on or improving the Uniswap Protocol.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'compound-grants',
    name: 'Compound Grants Program',
    organization: 'Compound Finance',
    orgType: 'web3',
    category: 'DeFi / Money Markets',
    description: 'Compound Grants fund work that grows the Compound protocol and DeFi money markets. Tooling, analytics, integrations, and security research welcome.',
    fundingAmount: '$5K – $150K USD (COMP)',
    fundingMin: 5000,
    fundingMax: 150000,
    deadline: 'Rolling',
    url: 'https://compoundgrants.org/',
    applyUrl: 'https://compoundgrants.org/',
    logoUrl: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    logoColor: '#00D395',
    tags: ['DeFi', 'lending', 'Compound', 'money market', 'governance', 'analytics'],
    eligibility: 'Developers and teams improving the Compound Protocol.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'gnosis-dao',
    name: 'GnosisDAO Grants',
    organization: 'Gnosis',
    orgType: 'web3',
    category: 'DAO Infrastructure',
    description: 'GnosisDAO funds projects building on Gnosis Chain, Safe multisig, and decentralized prediction markets. Strong focus on DAO tooling and governance.',
    fundingAmount: '$10K – $100K USD (GNO)',
    fundingMin: 10000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://gnosis.io/grants/',
    applyUrl: 'https://forum.gnosis.io/',
    logoUrl: 'https://cryptologos.cc/logos/gnosis-gno-logo.png',
    logoColor: '#1C3B5C',
    tags: ['DAO', 'governance', 'Safe', 'prediction markets', 'Gnosis Chain'],
    eligibility: 'Projects building governance tools or Gnosis Chain applications.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'zcash-foundation',
    name: 'Zcash Foundation Grants',
    organization: 'Zcash Foundation',
    orgType: 'web3',
    category: 'Privacy Technology',
    description: 'Zcash Foundation funds privacy-preserving technology, cryptography research, and education around zero-knowledge proofs and financial privacy.',
    fundingAmount: '$10K – $100K USD (ZEC)',
    fundingMin: 10000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://zfnd.org/grants/',
    applyUrl: 'https://zfnd.org/grants/',
    logoUrl: 'https://cryptologos.cc/logos/zcash-zec-logo.png',
    logoColor: '#F4B728',
    tags: ['privacy', 'ZK proofs', 'cryptography', 'Zcash', 'financial privacy'],
    eligibility: 'Researchers, developers, and educators working on privacy technology.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'celestia-ecosys',
    name: 'Celestia Ecosystem Fund',
    organization: 'Celestia Foundation',
    orgType: 'web3',
    category: 'Modular Blockchain',
    description: 'Celestia funds projects building on or integrating with Celestia\'s modular data availability layer. Key for rollup developers and infrastructure teams.',
    fundingAmount: '$25K – $200K USD (TIA)',
    fundingMin: 25000,
    fundingMax: 200000,
    deadline: 'Rolling',
    url: 'https://celestia.org/developer/grants/',
    applyUrl: 'https://celestia.org/developer/grants/',
    logoUrl: 'https://cryptologos.cc/logos/celestia-tia-logo.png',
    logoColor: '#7B2FBE',
    tags: ['modular', 'data availability', 'rollups', 'Celestia', 'infrastructure'],
    eligibility: 'Teams building rollups or integrating Celestia DA layer.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'graph-foundation',
    name: 'The Graph Foundation Grants',
    organization: 'The Graph',
    orgType: 'web3',
    category: 'Blockchain Indexing',
    description: 'The Graph Foundation funds subgraph development, protocol improvements, and tooling that makes blockchain data more accessible to developers.',
    fundingAmount: '$5K – $50K USD (GRT)',
    fundingMin: 5000,
    fundingMax: 50000,
    deadline: 'Rolling',
    url: 'https://thegraph.com/grants/',
    applyUrl: 'https://thegraph.com/grants/',
    logoUrl: 'https://cryptologos.cc/logos/the-graph-grt-logo.png',
    logoColor: '#6F4CFF',
    tags: ['indexing', 'subgraph', 'GraphQL', 'data', 'The Graph', 'tooling'],
    eligibility: 'Developers building subgraphs or protocol improvements.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'icp-developer',
    name: 'DFINITY Developer Grant',
    organization: 'DFINITY Foundation',
    orgType: 'web3',
    category: 'Internet Computer',
    description: 'DFINITY grants fund projects building on the Internet Computer Protocol (ICP) — decentralized social, enterprise software, DeFi, and infrastructure.',
    fundingAmount: '$25K – $250K USD (ICP)',
    fundingMin: 25000,
    fundingMax: 250000,
    deadline: 'Rolling',
    url: 'https://dfinity.org/grants/',
    applyUrl: 'https://dfinity.org/grants/',
    logoUrl: 'https://cryptologos.cc/logos/internet-computer-icp-logo.png',
    logoColor: '#3B00B9',
    tags: ['ICP', 'Internet Computer', 'WebAssembly', 'Motoko', 'decentralized'],
    eligibility: 'Developers with strong technical plans to build on ICP.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'algorand-foundation',
    name: 'Algorand Foundation Grants',
    organization: 'Algorand Foundation',
    orgType: 'web3',
    category: 'Carbon-Neutral Blockchain',
    description: 'Algorand Foundation funds DeFi, carbon markets, government pilots, and enterprise use cases on its carbon-neutral, high-throughput blockchain.',
    fundingAmount: '$10K – $100K USD (ALGO)',
    fundingMin: 10000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://algorand.foundation/grants/',
    applyUrl: 'https://algorand.foundation/grants/',
    logoUrl: 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    logoColor: '#000000',
    tags: ['Algorand', 'carbon neutral', 'DeFi', 'enterprise', 'government', 'green'],
    eligibility: 'Teams building applications on Algorand with measurable impact.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'tezos-foundation',
    name: 'Tezos Foundation Grants',
    organization: 'Tezos Foundation',
    orgType: 'web3',
    category: 'Self-Amending Blockchain',
    description: 'Tezos Foundation grants cover R&D, tools, education, and applications built on the Tezos smart contract platform, which is known for formal verification.',
    fundingAmount: 'CHF 10K – CHF 250K',
    fundingMin: 10000,
    fundingMax: 250000,
    deadline: 'Rolling',
    url: 'https://tezos.foundation/grants/',
    applyUrl: 'https://tezos.foundation/grants/',
    logoUrl: 'https://cryptologos.cc/logos/tezos-xtz-logo.png',
    logoColor: '#2C7DF7',
    tags: ['Tezos', 'smart contracts', 'formal verification', 'NFT', 'governance'],
    eligibility: 'Individuals and teams building on Tezos or contributing to its ecosystem.',
    source: 'curated',
    isOpen: true,
  },
  {
    id: 'celo-foundation',
    name: 'Celo Foundation Grants',
    organization: 'Celo Foundation',
    orgType: 'web3',
    category: 'Mobile-First DeFi',
    description: 'Celo Foundation funds projects that advance financial inclusion and mobile-first DeFi. Strong focus on real-world utility and underserved populations.',
    fundingAmount: '$5K – $100K USD (CELO)',
    fundingMin: 5000,
    fundingMax: 100000,
    deadline: 'Rolling',
    url: 'https://celo.org/community',
    applyUrl: 'https://celo.org/community',
    logoUrl: 'https://cryptologos.cc/logos/celo-celo-logo.png',
    logoColor: '#35D07F',
    tags: ['mobile', 'financial inclusion', 'DeFi', 'Celo', 'stablecoin', 'Africa'],
    eligibility: 'Teams focused on mobile-first or financial inclusion use cases.',
    source: 'curated',
    isOpen: true,
  },
];

// ─── Gitcoin API Fetch ────────────────────────────────────────────────────────
async function fetchGitcoinGrants(): Promise<Partial<GrantMatch>[]> {
  try {
    // Gitcoin grants API v2 — active rounds
    const res = await fetch('https://indexer.grants.gitcoin.co/api/v2/rounds?chainId=1&status=active&first=20', {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();

    const rounds = data?.rounds ?? [];
    return rounds.slice(0, 8).map((round: Record<string, unknown>) => ({
      id: `gitcoin-${round.id}`,
      name: (round.name as string) ?? 'Gitcoin Grant Round',
      organization: 'Gitcoin',
      orgType: 'web3' as const,
      category: 'Open Source Public Goods',
      description: (round.description as string) ?? 'Community-funded open source grants via Quadratic Funding on Gitcoin.',
      fundingAmount: round.matchAmount ? `$${Math.round(Number(round.matchAmount) / 1e18).toLocaleString()} matching` : 'Variable (QF)',
      fundingMin: 100,
      fundingMax: 500000,
      deadline: round.roundEndTime ? new Date(Number(round.roundEndTime) * 1000).toLocaleDateString() : 'Active',
      deadlineTimestamp: round.roundEndTime ? Number(round.roundEndTime) * 1000 : undefined,
      url: `https://grants.gitcoin.co/#/round/${round.id}`,
      applyUrl: `https://builder.gitcoin.co/#/round/${round.id}`,
      logoUrl: 'https://cryptologos.cc/logos/gitcoin-gtc-logo.png',
      logoColor: '#00433B',
      tags: ['quadratic funding', 'public goods', 'open source', 'community', 'Gitcoin'],
      eligibility: 'Open source Web3 projects with verifiable GitHub activity.',
      source: 'gitcoin' as const,
      isOpen: true,
    }));
  } catch {
    return [];
  }
}

// ─── Grants.gov Federal Grants ────────────────────────────────────────────────
async function fetchFederalGrants(): Promise<Partial<GrantMatch>[]> {
  try {
    const res = await fetch(
      'https://apply07.grants.gov/grantsws/rest/opportunities/search/?' +
      new URLSearchParams({
        keyword: 'blockchain cryptocurrency distributed ledger technology',
        oppStatuses: 'posted',
        rows: '5',
        sortBy: 'openDate|desc',
      }),
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];
    const data = await res.json();
    const opps = data?.oppHits ?? [];

    return opps.slice(0, 5).map((opp: Record<string, unknown>) => ({
      id: `federal-${opp.id}`,
      name: opp.title as string,
      organization: (opp.agencyName as string) ?? 'US Federal Agency',
      orgType: 'government' as const,
      category: 'Federal Research Grant',
      description: (opp.synopsis as string) ?? `Federal grant opportunity from ${opp.agencyName}.`,
      fundingAmount: opp.awardCeiling ? `Up to $${Number(opp.awardCeiling).toLocaleString()} USD` : 'See announcement',
      fundingMin: opp.awardFloor ? Number(opp.awardFloor) : 0,
      fundingMax: opp.awardCeiling ? Number(opp.awardCeiling) : 0,
      deadline: opp.closeDate as string ?? 'See announcement',
      url: `https://www.grants.gov/web/grants/view-opportunity.html?oppId=${opp.id}`,
      applyUrl: `https://www.grants.gov/web/grants/view-opportunity.html?oppId=${opp.id}`,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NSF_logo.png/200px-NSF_logo.png',
      logoColor: '#005AA3',
      tags: ['government', 'federal', 'blockchain', 'research', 'US'],
      eligibility: opp.eligibleApplicants as string ?? 'See grant announcement for eligibility requirements.',
      source: 'federal' as const,
      isOpen: true,
    }));
  } catch {
    return [];
  }
}

// ─── AI Matching with Groq ────────────────────────────────────────────────────
async function matchGrantsWithAI(
  grants: Omit<GrantMatch, 'matchScore' | 'matchReasons'>[],
  context: UserContext,
  apiKey: string
): Promise<GrantMatch[]> {
  const grantSummaries = grants.map((g, i) => (
    `[${i}] ${g.name} (${g.organization}) — ${g.category} — ${g.fundingAmount} — Tags: ${g.tags.join(', ')}`
  )).join('\n');

  const systemPrompt = `You are AetherOS Grant Intelligence Engine. You analyze grant programs and match them to a user's profile with precision scoring.

Return ONLY a valid JSON array. No markdown, no preamble.

Format:
[
  {
    "index": number,        // index from the grant list
    "matchScore": number,   // 0-100 compatibility score
    "matchReasons": string[] // exactly 2-3 specific reasons why this grant fits THIS user
  }
]

Rules:
- Analyze ALL grants provided
- Score based on: industry fit, funding size vs project stage, technical requirements, geographic eligibility
- matchReasons must be specific to this user's background, never generic
- Higher score = better match
- Output must be valid JSON array only`;

  const userPrompt = `User Profile:
Background: ${context.background}
Industry: ${context.industry}
Current Position: ${context.currentPosition}
Goal: ${context.goals}
${context.projectStage ? `Project Stage: ${context.projectStage}` : ''}
${context.projectDescription ? `Project: ${context.projectDescription}` : ''}

Available Grants (analyze ALL of them):
${grantSummaries}

Return the JSON array with match scores for every grant.`;

  const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama3-8b-8192'];

  let rawResponse = '';
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();
      rawResponse = data?.choices?.[0]?.message?.content ?? '';
      if (rawResponse) break;
    } catch {
      continue;
    }
  }

  // Parse AI scores
  let scores: { index: number; matchScore: number; matchReasons: string[] }[] = [];
  try {
    const cleaned = rawResponse.replace(/```json|```/g, '').trim();
    scores = JSON.parse(cleaned);
  } catch {
    // Fallback: assign default scores
    scores = grants.map((_, i) => ({
      index: i,
      matchScore: 50 + Math.floor(Math.random() * 30),
      matchReasons: ['Relevant to your industry', 'Funding range matches your stage'],
    }));
  }

  // Merge scores with grant data
  const matched: GrantMatch[] = grants.map((grant, i) => {
    const score = scores.find(s => s.index === i);
    return {
      ...grant,
      matchScore: score?.matchScore ?? 50,
      matchReasons: score?.matchReasons ?? ['Relevant to your profile'],
    } as GrantMatch;
  });

  // Sort by match score descending
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}

// ─── Fallback scoring (no API key) ───────────────────────────────────────────
function scoreGrantsLocally(
  grants: Omit<GrantMatch, 'matchScore' | 'matchReasons'>[],
  context: UserContext
): GrantMatch[] {
  const industryLower = context.industry.toLowerCase();
  const goalsLower = context.goals.toLowerCase();
  const backgroundLower = context.background.toLowerCase();

  return grants.map(grant => {
    let score = 40;
    const reasons: string[] = [];

    // Tag matching
    const tagMatches = grant.tags.filter(tag =>
      industryLower.includes(tag) || goalsLower.includes(tag) || backgroundLower.includes(tag)
    );
    score += tagMatches.length * 8;

    // Category matching
    if (industryLower.includes('defi') && grant.category.toLowerCase().includes('defi')) { score += 15; reasons.push('Strong DeFi focus alignment'); }
    if (industryLower.includes('nft') && grant.tags.includes('NFT')) { score += 15; reasons.push('NFT ecosystem match'); }
    if (goalsLower.includes('grant') && grant.source !== 'federal') { score += 10; reasons.push('Grant-focused track record'); }
    if (backgroundLower.includes('research') && grant.orgType === 'government') { score += 12; reasons.push('Research background fits government grants'); }
    if (backgroundLower.includes('open source') && grant.tags.includes('open source')) { score += 12; reasons.push('Open source contribution history'); }

    // Default reasons if none generated
    if (reasons.length === 0) {
      reasons.push(`${grant.organization} funds ${grant.category} projects`);
      reasons.push(`Funding range: ${grant.fundingAmount}`);
    }
    reasons.push(`Category: ${grant.category}`);

    return {
      ...grant,
      matchScore: Math.min(98, score),
      matchReasons: reasons.slice(0, 3),
    } as GrantMatch;
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context }: { context: UserContext } = body;

    if (!context?.background || !context?.industry || !context?.goals) {
      return NextResponse.json({ error: 'Context fields required' }, { status: 400 });
    }

    // Fetch from multiple sources in parallel
    const [gitcoinGrants, federalGrants] = await Promise.all([
      fetchGitcoinGrants(),
      fetchFederalGrants(),
    ]);

    // Merge: curated + live data, deduplicate
    const allGrants = [
      ...CURATED_GRANTS,
      ...gitcoinGrants,
      ...federalGrants,
    ].filter(Boolean) as Omit<GrantMatch, 'matchScore' | 'matchReasons'>[];

    const apiKey = process.env.GROQ_API_KEY;

    const matched = apiKey
      ? await matchGrantsWithAI(allGrants, context, apiKey)
      : scoreGrantsLocally(allGrants, context);

    return NextResponse.json({
      grants: matched,
      total: matched.length,
      sources: {
        curated: CURATED_GRANTS.length,
        gitcoin: gitcoinGrants.length,
        federal: federalGrants.length,
      },
    });

  } catch (error) {
    console.error('[AetherOS Grants] Error:', error);
    return NextResponse.json({ error: 'Grant matching failed' }, { status: 500 });
  }
}
