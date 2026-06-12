import { NextRequest, NextResponse } from 'next/server';

interface UserContext {
  background: string;
  industry: string;
  goals: string;
  currentPosition: string;
}

interface RoadmapStep {
  step: number;
  title: string;
  summary: string;
  actions: string[];
  timeframe: string;
}

interface NetworkTarget {
  title: string;
  why: string;
  approach: string;
  compatibilityScore: number;
  scoreBreakdown: { label: string; score: number }[];
}

interface Web3Resource {
  name: string;
  category: string;
  relevance: string;
  matchScore: number;
}

interface StrategyOutput {
  roadmap: RoadmapStep[];
  targets: NetworkTarget[];
  web3Resources: Web3Resource[];
  keyInsight: string;
  unfairAdvantage: string;
}

// Curated Web3 protocol database with verified URLs
const WEB3_PROTOCOL_DB: Record<string, { url: string; description: string; category: string }> = {
  'Uniswap': { url: 'https://uniswap.org', description: 'Leading decentralized exchange protocol', category: 'DeFi' },
  'Aave': { url: 'https://aave.com', description: 'Decentralized liquidity protocol', category: 'DeFi' },
  'Compound': { url: 'https://compound.finance', description: 'Algorithmic money market protocol', category: 'DeFi' },
  'MakerDAO': { url: 'https://makerdao.com', description: 'DAI stablecoin and governance protocol', category: 'DeFi' },
  'Curve Finance': { url: 'https://curve.fi', description: 'Stablecoin-optimized AMM', category: 'DeFi' },
  'Lido': { url: 'https://lido.fi', description: 'Liquid staking for Ethereum', category: 'Staking' },
  'Stacks': { url: 'https://stacks.co', description: 'Bitcoin L2 for smart contracts', category: 'Infrastructure' },
  'Lens Protocol': { url: 'https://lens.xyz', description: 'Decentralized social graph', category: 'Social' },
  'Farcaster': { url: 'https://farcaster.xyz', description: 'Decentralized social network', category: 'Social' },
  'Gitcoin': { url: 'https://gitcoin.co', description: 'Web3 grants and public goods funding', category: 'Grants' },
  'Optimism': { url: 'https://optimism.io', description: 'Ethereum L2 scaling solution', category: 'Infrastructure' },
  'Arbitrum': { url: 'https://arbitrum.io', description: 'Ethereum L2 scaling with Nitro', category: 'Infrastructure' },
  'Chainlink': { url: 'https://chain.link', description: 'Decentralized oracle network', category: 'Infrastructure' },
  'The Graph': { url: 'https://thegraph.com', description: 'Indexing protocol for blockchain data', category: 'Infrastructure' },
  'Snapshot': { url: 'https://snapshot.org', description: 'Decentralized governance voting', category: 'Governance' },
  'Gnosis Safe': { url: 'https://safe.global', description: 'Multisig wallet for DAOs and teams', category: 'Tooling' },
  'Dune Analytics': { url: 'https://dune.com', description: 'On-chain data analytics platform', category: 'Analytics' },
  'Nansen': { url: 'https://nansen.ai', description: 'Blockchain analytics and intelligence', category: 'Analytics' },
  'Messari': { url: 'https://messari.io', description: 'Crypto research and intelligence', category: 'Research' },
  'Bankless': { url: 'https://bankless.com', description: 'Web3 media and community', category: 'Community' },
  'Decrypt': { url: 'https://decrypt.co', description: 'Crypto news and education', category: 'Media' },
  'CoinDesk': { url: 'https://coindesk.com', description: 'Leading crypto media outlet', category: 'Media' },
  'DefiLlama': { url: 'https://defillama.com', description: 'DeFi TVL tracker and analytics', category: 'Analytics' },
  'OpenSea': { url: 'https://opensea.io', description: 'NFT marketplace', category: 'NFT' },
  'Blur': { url: 'https://blur.io', description: 'NFT marketplace for pro traders', category: 'NFT' },
  'Zora': { url: 'https://zora.co', description: 'On-chain creator marketplace', category: 'NFT' },
  'Mirror': { url: 'https://mirror.xyz', description: 'Decentralized publishing platform', category: 'Social' },
  'Polygon': { url: 'https://polygon.technology', description: 'Ethereum scaling ecosystem', category: 'Infrastructure' },
  'Solana': { url: 'https://solana.com', description: 'High-performance blockchain', category: 'Infrastructure' },
  'Near Protocol': { url: 'https://near.org', description: 'User-friendly blockchain platform', category: 'Infrastructure' },
  'Aptos': { url: 'https://aptoslabs.com', description: 'L1 blockchain with Move language', category: 'Infrastructure' },
  'Sui': { url: 'https://sui.io', description: 'L1 blockchain with object model', category: 'Infrastructure' },
  'Frax Finance': { url: 'https://frax.finance', description: 'Fractional algorithmic stablecoin', category: 'DeFi' },
  'Balancer': { url: 'https://balancer.fi', description: 'Automated portfolio manager and AMM', category: 'DeFi' },
  'dYdX': { url: 'https://dydx.exchange', description: 'Decentralized perpetuals exchange', category: 'DeFi' },
  'GMX': { url: 'https://gmx.io', description: 'Decentralized perpetual exchange', category: 'DeFi' },
  'Yearn Finance': { url: 'https://yearn.fi', description: 'Yield optimization protocol', category: 'DeFi' },
  'Convex Finance': { url: 'https://convexfinance.com', description: 'Curve yield boosting', category: 'DeFi' },
  'Eigenlayer': { url: 'https://eigenlayer.xyz', description: 'Restaking protocol on Ethereum', category: 'Infrastructure' },
  'Celestia': { url: 'https://celestia.org', description: 'Modular blockchain data availability', category: 'Infrastructure' },
};

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
];

async function callGroq(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Groq API error [${model}]: ${response.status} — ${JSON.stringify(errData)}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`No content returned from model: ${model}`);
  return text;
}

async function generateWithFallback(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of GROQ_MODELS) {
    try {
      return await callGroq(apiKey, model, systemPrompt, userPrompt);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError ?? new Error('All Groq models failed');
}

function enrichWithUrls(resources: Web3Resource[]): (Web3Resource & { url: string; dbDescription: string })[] {
  return resources.map(r => {
    const dbEntry = WEB3_PROTOCOL_DB[r.name];
    return {
      ...r,
      url: dbEntry?.url ?? `https://www.google.com/search?q=${encodeURIComponent(r.name + ' web3')}`,
      dbDescription: dbEntry?.description ?? r.relevance,
    };
  });
}

function generateDemoOutput(context: UserContext): StrategyOutput {
  return {
    keyInsight: `Your background in ${context.industry} gives you rare cross-domain credibility — most Web3 builders lack your traditional market perspective.`,
    unfairAdvantage: `Bridging ${context.industry} expertise with Web3-native thinking. This positions you as a translator between two worlds, which is exactly what protocols need.`,
    roadmap: [
      {
        step: 1, title: 'Context Audit', timeframe: 'Day 1–2',
        summary: 'Map your current network and identify strategic gaps',
        actions: ['List top 20 existing contacts by influence', 'Identify 3 vertical gaps in your network', 'Define your "signature insight" in one sentence'],
      },
      {
        step: 2, title: 'Target Identification', timeframe: 'Day 3–5',
        summary: `Pinpoint 5 high-value individuals in ${context.industry} + Web3 overlap`,
        actions: ['Search LinkedIn for "Head of DeFi" + your vertical', 'Find active voices on Farcaster in your niche', 'Identify 2 DAO contributors solving your problem'],
      },
      {
        step: 3, title: 'Value Architecture', timeframe: 'Day 6–7',
        summary: 'Build your give-first playbook before any outreach',
        actions: ['Write one original insight post on Farcaster/Mirror', 'Prepare 3 introductions you can offer each target', 'Create a "research gift" — a 1-page market analysis'],
      },
      {
        step: 4, title: 'Precision Outreach', timeframe: 'Week 2',
        summary: 'Execute high-signal first contact with each target',
        actions: ['Send DMs referencing their specific recent work', 'Lead with value — share your research gift', 'Request 15-min calls, not coffee chats'],
      },
      {
        step: 5, title: 'Relationship Depth', timeframe: 'Week 3',
        summary: 'Move from connection to genuine collaboration',
        actions: ['Co-create a piece of content or analysis', 'Make one meaningful intro to each contact', 'Attend one DAO governance call together'],
      },
      {
        step: 6, title: 'Network Leverage', timeframe: 'Week 4',
        summary: 'Activate your expanded network for your goal',
        actions: [`Make your ask: ${context.goals}`, 'Leverage warm intros from Week 3 contacts', 'Document outcomes and refine the playbook'],
      },
      {
        step: 7, title: 'Compound Effect', timeframe: 'Month 2+',
        summary: 'Systematize relationship building at scale',
        actions: ['Set monthly check-ins with top 10 contacts', 'Build a "second brain" of contact intelligence', 'Host a small virtual gathering for your network'],
      },
    ],
    targets: [
      {
        title: 'Protocol Growth Leads',
        why: `They control partnerships and ecosystem expansion — directly aligned with "${context.goals}"`,
        approach: 'Come with data on their protocol metrics and a specific growth hypothesis',
        compatibilityScore: 87,
        scoreBreakdown: [
          { label: 'Goal alignment', score: 92 },
          { label: 'Background fit', score: 85 },
          { label: 'Access difficulty', score: 60 },
          { label: 'Leverage potential', score: 95 },
        ],
      },
      {
        title: 'DAO Core Contributors',
        why: 'Gatekeepers of community trust and on-chain governance — high leverage per connection',
        approach: 'Participate in governance first, then DM with a specific improvement proposal',
        compatibilityScore: 79,
        scoreBreakdown: [
          { label: 'Goal alignment', score: 75 },
          { label: 'Background fit', score: 80 },
          { label: 'Access difficulty', score: 85 },
          { label: 'Leverage potential', score: 78 },
        ],
      },
      {
        title: 'Web3 VCs & Angels',
        why: 'Capital plus introductions — one relationship unlocks an entire portfolio network',
        approach: 'Lead with deal flow or a counterintuitive market thesis, never ask for money first',
        compatibilityScore: 72,
        scoreBreakdown: [
          { label: 'Goal alignment', score: 80 },
          { label: 'Background fit', score: 70 },
          { label: 'Access difficulty', score: 45 },
          { label: 'Leverage potential', score: 90 },
        ],
      },
    ],
    web3Resources: [
      { name: 'Farcaster', category: 'Social', relevance: 'Best place to build credibility with Web3 builders in real-time', matchScore: 94 },
      { name: 'Lens Protocol', category: 'Social', relevance: 'Own your social graph and reach DeFi-native audiences', matchScore: 88 },
      { name: 'Gitcoin', category: 'Grants', relevance: 'Fund projects and meet serious ecosystem builders', matchScore: 82 },
      { name: 'Snapshot', category: 'Governance', relevance: 'Participate in DAO governance to build insider relationships', matchScore: 78 },
      { name: 'Dune Analytics', category: 'Analytics', relevance: 'Create on-chain dashboards to showcase analytical credibility', matchScore: 85 },
      { name: 'Mirror', category: 'Social', relevance: 'Publish long-form Web3 insights that attract high-quality readers', matchScore: 80 },
    ],
  };
}

// Server-safe check premium — langsung call Hiro API tanpa @stacks/transactions
async function checkPremiumServer(walletAddress: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.mainnet.hiro.so/v2/contracts/call-read/SPQ189E66S20X7ATY7794HBY6743JE9YJMCKHAEF/aetheros-staking/is-premium-eligible`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: walletAddress,
          arguments: [`0x${Buffer.from(`${walletAddress}`).toString('hex')}`],
        }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data?.result === '0x03'; // Clarity (ok true) = 0x03
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, walletAddress }: { context: UserContext; walletAddress?: string } = body;

    if (!context?.background || !context?.industry || !context?.goals || !context?.currentPosition) {
      return NextResponse.json({ error: 'All context fields are required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      const demo = generateDemoOutput(context);
      const enriched = { ...demo, web3Resources: enrichWithUrls(demo.web3Resources) };

      if (walletAddress) {
        try {
          const { saveStrategy } = await import('@/lib/strategyHistory');
          const premium = await checkPremiumServer(walletAddress);
          await saveStrategy(walletAddress, premium, context, enriched);
        } catch (saveErr) {
          console.warn('[AetherOS] Firebase save failed:', saveErr);
        }
      }

      return NextResponse.json({ strategy: enriched, model: 'demo' });
    }

    const availableProtocols = Object.keys(WEB3_PROTOCOL_DB).join(', ');

    const systemPrompt = `You are AetherOS — an elite Web3 network intelligence engine. You output ONLY valid JSON, no markdown, no preamble, no explanation.

Your JSON must exactly match this TypeScript interface:
{
  "keyInsight": string,           // 1-2 sentences: the user's biggest strategic insight
  "unfairAdvantage": string,      // 1-2 sentences: their unique edge in Web3 networking
  "roadmap": [                    // exactly 7 steps
    {
      "step": number,
      "title": string,            // 2-4 words
      "timeframe": string,        // e.g. "Day 1–2", "Week 2"
      "summary": string,          // 1 sentence describing this step
      "actions": string[]         // exactly 3 specific, actionable items
    }
  ],
  "targets": [                    // exactly 3 target profiles
    {
      "title": string,            // the type of person to target
      "why": string,              // why they matter for this specific user
      "approach": string,         // concrete first-contact strategy
      "compatibilityScore": number, // 0-100 overall match
      "scoreBreakdown": [
        { "label": "Goal alignment", "score": number },
        { "label": "Background fit", "score": number },
        { "label": "Access difficulty", "score": number },
        { "label": "Leverage potential", "score": number }
      ]
    }
  ],
  "web3Resources": [              // exactly 6 protocols from the approved list
    {
      "name": string,             // MUST be one of the approved protocol names
      "category": string,
      "relevance": string,        // why this specific protocol fits THIS user
      "matchScore": number        // 0-100
    }
  ]
}

APPROVED PROTOCOL NAMES (use exact spelling): ${availableProtocols}

Rules:
- All scores must be integers between 40 and 98
- Access difficulty: higher score = easier to access
- web3Resources names MUST exactly match an approved protocol name
- Be specific to the user's actual background, not generic
- Output pure JSON only — no \`\`\`json wrapper`;

    const userPrompt = `Generate a complete Web3 networking strategy for:
Background: ${context.background}
Industry: ${context.industry}
Current Position: ${context.currentPosition}
Goal: ${context.goals}
${walletAddress ? `Stacks Wallet: ${walletAddress}` : ''}

Return only the JSON object.`;

    const raw = await generateWithFallback(apiKey, systemPrompt, userPrompt);

    let parsed: StrategyOutput;
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[AetherOS] JSON parse failed, using demo fallback');
      parsed = generateDemoOutput(context);
    }

    const enriched = { ...parsed, web3Resources: enrichWithUrls(parsed.web3Resources) };

    // Save to Firebase if wallet is connected
    if (walletAddress) {
      try {
        const { saveStrategy } = await import('@/lib/strategyHistory');
        const premium = await checkPremiumServer(walletAddress);
        await saveStrategy(walletAddress, premium, context, enriched);
      } catch (saveErr) {
        // Non-fatal — strategy still returns even if save fails
        console.warn('[AetherOS] Firebase save failed:', saveErr);
      }
    }

    return NextResponse.json({ strategy: enriched, model: 'groq' });

  } catch (error) {
    console.error('[AetherOS] Strategy API error:', error);
    return NextResponse.json({ error: 'Strategy generation failed. Please try again.' }, { status: 500 });
  }
}
