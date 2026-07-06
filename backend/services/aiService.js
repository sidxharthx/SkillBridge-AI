/**
 * AI Service - OpenRouter integration (speed-optimized).
 *
 * Uses fast models by default for quick responses.
 * Primary: step-3.5-flash (fast), Fallback: nemotron-nano (fastest)
 */

const MODEL = () => process.env.OPENROUTER_MODEL || 'stepfun/step-3.5-flash:free';
const FALLBACK_MODEL = () =>
  process.env.OPENROUTER_FALLBACK_MODEL || 'nvidia/nemotron-nano-9b-v2:free';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT_MS = 30000; // 30s timeout (was 60s)

/**
 * Call OpenRouter API with retry and fallback.
 */
async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = options.model || MODEL();
  const fallback = options.fallback || FALLBACK_MODEL();

  try {
    const result = await makeRequest(apiKey, model, messages, options);
    return result;
  } catch (primaryError) {
    console.warn(`Primary model (${model}) failed:`, primaryError.message);
    console.log(`Retrying with fallback model: ${fallback}`);

    try {
      const result = await makeRequest(apiKey, fallback, messages, options);
      return result;
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError.message);
      throw new Error(
        'AI service is temporarily unavailable. Please try again later.'
      );
    }
  }
}

async function makeRequest(apiKey, model, messages, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || TIMEOUT_MS
  );

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://skillbridge-ai.app',
        'X-Title': 'SkillBridge AI',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.4,
        max_tokens: options.maxTokens || 2000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorBody}`
      );
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI model');
    }

    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Attempt to parse JSON from AI response, handling markdown code blocks.
 */
function safeParseJSON(content) {
  let cleaned = content.trim();

  // Remove markdown code blocks
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }

  // Remove <think>...</think> blocks from reasoning models
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (e2) {
        // ignore
      }
    }

    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch (e3) {
        // ignore
      }
    }

    return null;
  }
}

// ─── Prompt Templates (concise for speed) ────────────────────────

function buildRoadmapPrompt(currentSkills, missingSkills, targetRole) {
  return [
    {
      role: 'system',
      content:
        'You are a career mentor. Return ONLY valid JSON, no markdown wrapping, no explanation.',
    },
    {
      role: 'user',
      content: `Career roadmap for "${targetRole}".
Has: ${currentSkills.slice(0, 15).join(', ')}
Needs: ${missingSkills.slice(0, 10).join(', ')}

Return JSON:
{"targetRole":"${targetRole}","estimatedTimeline":"X months","summary":"one line","phases":[{"phaseNumber":1,"title":"","duration":"","description":"","skills":[""],"projects":[{"name":"","description":""}],"resources":[{"title":"","type":"","url":""}],"certifications":[""],"milestones":[""]}],"interviewPrep":{"topics":[""],"tips":[""]}}

Create exactly 3 phases. Be brief.`,
    },
  ];
}

function buildSkillGapPrompt(currentSkills, missingSkills, targetRole) {
  return [
    {
      role: 'system',
      content: 'Expert career advisor. Be concise. Plain text only.',
    },
    {
      role: 'user',
      content: `Skill gap for "${targetRole}":
Has: ${currentSkills.slice(0, 15).join(', ')}
Missing: ${missingSkills.slice(0, 10).join(', ')}

In under 200 words: 1) Most critical missing skills 2) Strongest existing skills 3) Learning order 4) Timeline 5) Quick wins for first 2 weeks`,
    },
  ];
}

function buildResumeSummaryPrompt(parsedText) {
  return [
    {
      role: 'system',
      content: 'Resume reviewer. 2-3 sentences max.',
    },
    {
      role: 'user',
      content: `Summarize this resume highlighting key strengths:\n\n${parsedText.substring(0, 2000)}`,
    },
  ];
}

function buildRoleRecommendationPrompt(skills) {
  return [
    {
      role: 'system',
      content: 'Career advisor. Return ONLY a JSON array, no markdown.',
    },
    {
      role: 'user',
      content: `Skills: ${skills.slice(0, 15).join(', ')}

Suggest 3 roles. Return JSON array only:
[{"role":"","match":"high/medium","reason":"one line"}]`,
    },
  ];
}

// ─── Public API ──────────────────────────────────────────────────

async function generateRoadmap(currentSkills, missingSkills, targetRole) {
  const messages = buildRoadmapPrompt(currentSkills, missingSkills, targetRole);
  const response = await callOpenRouter(messages, { maxTokens: 2500 });
  const parsed = safeParseJSON(response);

  return {
    structured: parsed,
    raw: response,
  };
}

async function generateSkillGapExplanation(
  currentSkills,
  missingSkills,
  targetRole
) {
  const messages = buildSkillGapPrompt(currentSkills, missingSkills, targetRole);
  return callOpenRouter(messages, { maxTokens: 800 });
}

async function generateResumeSummary(parsedText) {
  const messages = buildResumeSummaryPrompt(parsedText);
  return callOpenRouter(messages, { maxTokens: 300 });
}

async function generateRoleRecommendations(skills) {
  const messages = buildRoleRecommendationPrompt(skills);
  const response = await callOpenRouter(messages, { maxTokens: 500 });
  return safeParseJSON(response) || [];
}

module.exports = {
  generateRoadmap,
  generateSkillGapExplanation,
  generateResumeSummary,
  generateRoleRecommendations,
  callOpenRouter,
  safeParseJSON,
};
