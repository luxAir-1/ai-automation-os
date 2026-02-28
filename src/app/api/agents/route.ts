import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.AI_MODEL || 'qwen3.5:cloud'

export async function POST(request: NextRequest) {
  try {
    const { task, context, agent } = await request.json()

    if (!task) {
      return NextResponse.json({ error: 'Task required' }, { status: 400 })
    }

    // Route to appropriate agent
    const agentPrompt = getAgentPrompt(agent || 'general')
    const fullPrompt = `${agentPrompt}\n\nContext: ${context || 'No additional context'}\n\nTask: ${task}`

    // Call Ollama (TinyLlama or Qwen)
    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      agent,
      response: data.response,
      model: DEFAULT_MODEL,
    })
  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Agent failed' },
      { status: 500 }
    )
  }
}

function getAgentPrompt(agent: string): string {
  const agents: Record<string, string> = {
    general: `You are an AI assistant for AAOS (AI Automation OS). Be concise, helpful, and action-oriented.`,
    
    researcher: `You are a research agent for AAOS. Find information, summarize sources, and provide actionable insights. Always cite sources when possible.`,
    
    coder: `You are a coding agent for AAOS. Write clean, production-ready code. Explain your decisions briefly. Prefer modern best practices.`,
    
    analyst: `You are a data analyst agent for AAOS. Interpret data, identify patterns, and provide clear recommendations. Use bullet points for clarity.`,
    
    scheduler: `You are a scheduling agent for AAOS. Help organize tasks, set priorities, and manage timelines. Be specific about deadlines.`,
  }

  return agents[agent] || agents.general
}
