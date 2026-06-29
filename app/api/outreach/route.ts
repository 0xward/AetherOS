import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { targetName, targetRole, context, channel='LinkedIn DM' } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ draft: `Hi ${targetName}, I’m building AetherOS, an AI-powered professional network intelligence layer secured on Bitcoin via Stacks. Based on your work as ${targetRole}, I’d love to connect and explore a focused collaboration. Would you be open to a quick intro call this week?` });
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:'Write concise high-converting professional outreach. No fluff.'},{role:'user',content:`Channel: ${channel}\nTarget: ${targetName}, ${targetRole}\nContext: ${context}\nReturn one polished message.`}],temperature:.7})});
  const j=await r.json(); return NextResponse.json({ draft:j?.choices?.[0]?.message?.content || 'Draft unavailable.' });
}
