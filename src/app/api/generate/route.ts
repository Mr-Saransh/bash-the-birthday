import { NextResponse } from 'next/server';
import type { BirthdayData, GeneratedContent } from '@/lib/types';
import { generateContent as generateFallbackContent } from '@/engine/content-generator';

const AI_API_KEY = process.env.AI_API_KEY || 'sk-bl-SoPobY0NEGK4NDVt08CyFrdCpbwvbqEMwywLtr_ER2ULE_fN';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.bazaarlink.ai/v1';
const AI_MODEL = process.env.AI_MODEL || 'auto:free';

export async function POST(req: Request) {
  try {
    const data: BirthdayData = await req.json();

    if (!data.recipientName || !data.senderName) {
      return NextResponse.json({ error: 'recipientName and senderName are required' }, { status: 400 });
    }

    const name = data.recipientName.split(' ')[0] || data.recipientName;
    const sender = data.senderName;
    const relationship = data.relationship || 'friend';
    const personality = data.personality || 'main-character';
    const favoriteThing = data.favoriteThing || 'being wonderful';
    const quirk = data.quirkOrHabit || '';
    const superpower = data.superpowerOrTitle || '';
    const favoriteSong = data.favoriteSong || '';
    const insideJoke = data.insideJoke || '';
    const memory = data.memory || '';
    const message = data.optionalMessage || '';

    // Prompt engineered specifically for zero generic guessing
    const userPrompt = `
Generate a deeply authentic, funny, and emotional birthday surprise narrative.
Recipient: "${name}"
Sender: "${sender}" (${relationship})
Atmosphere / Vibe: "${personality}"
What sender adores about them: "${favoriteThing}"
${quirk ? `Their funny quirk / habit / catchphrase: "${quirk}"` : ''}
${superpower ? `Their superpower / signature trait: "${superpower}"` : ''}
${favoriteSong ? `Their favorite song / anthem / music: "${favoriteSong}"` : ''}
${insideJoke ? `Inside joke / private reference: "${insideJoke}"` : ''}
${memory ? `Shared memory to celebrate: "${memory}"` : ''}
${message ? `Sender's personal message: "${message}"` : ''}

CRITICAL RULES:
1. NO generic filler or guessing (NEVER say generic stuff like "music lover" or "great friend").
2. Explicitly reference their specific details (quirk, song, memory, inside joke) with charm and emotional depth.
3. Keep the tone warm, celebratory, and genuinely funny or touching.

Return strictly valid JSON without markdown code blocks, matching this exact interface:
{
  "introLines": ["3 progressive suspenseful lines teasing the birthday surprise for ${name}"],
  "personalityTitle": "A witty or royal personalized title for them (e.g. Chief Parallel Universe Investigator)",
  "personalityDescriptors": ["3 deeply personal, hilarious, or touching descriptors matching their exact vibe and quirks"],
  "observations": ["4 hyper-specific observations about them incorporating their habits, quirks, or inside jokes"],
  "relationshipLine": "1 heartfelt, beautiful line describing the bond between ${sender} and ${name}",
  "memoryIntro": "1 evocative sentence introducing their shared memory",
  "memoryTribute": "A warm cinematic mini-recounting of the memory",
  "emotionalTransition": "A poignant transition line before the sincere blessing",
  "fallbackMessage": "A touching 2-sentence note if sender didn't write a long message",
  "finalLine": "An epic, unforgettable closing birthday prophecy for the year ahead",
  "secretMessage": "A playful secret message revealed when they discover the hidden star",
  "soundtrackNote": "${favoriteSong ? `Dedicated with their anthem: ${favoriteSong}` : ''}"
}
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second safety timeout for AI gateway

    try {
      const aiResponse = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are an elite creative writer specializing in personalized digital birthday experiences. You strictly output valid JSON with zero generic clichés.',
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.8,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const json = await aiResponse.json();
        const rawContent = json.choices?.[0]?.message?.content?.trim();
        if (rawContent) {
          // Clean potential markdown wrapper ```json ... ```
          const cleaned = rawContent
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

          const parsed = JSON.parse(cleaned);

          if (parsed.introLines && Array.isArray(parsed.observations) && parsed.finalLine) {
            const result: GeneratedContent = {
              introLines: parsed.introLines,
              personalityTitle: parsed.personalityTitle || `${name}, The One and Only`,
              personalityDescriptors: parsed.personalityDescriptors || [],
              observations: parsed.observations,
              memoryIntro: parsed.memoryIntro || 'One thing they wanted you to remember…',
              memoryTribute: parsed.memoryTribute || memory,
              emotionalTransition: parsed.emotionalTransition || 'Okay, real talk for a moment.',
              fallbackMessage: parsed.fallbackMessage || 'The world is brighter because you are in it.',
              finalLine: parsed.finalLine,
              secretMessage: parsed.secretMessage || 'You found the secret. You truly notice everything.',
              relationshipLine: parsed.relationshipLine || 'Someone whose presence makes everything better.',
              soundtrackNote: parsed.soundtrackNote || (favoriteSong ? `Vibing to ${favoriteSong}` : undefined),
            };

            return NextResponse.json({ success: true, content: result, source: 'ai' });
          }
        }
      }
    } catch (aiErr) {
      console.warn('AI generation call failed or timed out, using enhanced fallback:', aiErr);
    } finally {
      clearTimeout(timeoutId);
    }

    // High quality offline fallback with full personalized data
    const fallback = generateFallbackContent(data);
    return NextResponse.json({ success: true, content: fallback, source: 'procedural' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown generation error';
    console.error('Generate route error:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
