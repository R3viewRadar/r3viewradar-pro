import type { Profile, Review } from "@/types";

/**
 * AI-powered summary generator using OpenAI.
 * Analyzes reviews and generates a professional summary for the profile page.
 * Falls back to a template summary when OpenAI is not configured.
 */
export async function generateAISummary(
  profile: Profile,
  reviews: Review[]
): Promise<string> {
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    return generateTemplateSummary(profile, reviews);
  }

  try {
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: openAiKey });

    const reviewSample = reviews
      .slice(0, 10)
      .map((r) => `"${r.body}" (${r.rating}/5 stars)`)
      .join("\n");

    const prompt = `You are a professional reputation analyst. Based on the following information about ${profile.name}, a ${profile.subcategory} in ${profile.city}, ${profile.state}, generate a concise 2-3 sentence professional summary highlighting their strengths, expertise, and client satisfaction. Keep it factual and professional.

Reviews sample:
${reviewSample}

Rating: ${profile.overall_rating}/5 based on ${profile.review_count} reviews
Experience: ${profile.years_experience} years
Specialties: ${profile.specialties.join(", ")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content ?? generateTemplateSummary(profile, reviews);
  } catch (error) {
    console.error("OpenAI summary generation failed:", error);
    return generateTemplateSummary(profile, reviews);
  }
}

function generateTemplateSummary(profile: Profile, reviews: Review[]): string {
  const positiveCount = reviews.filter((r) => r.rating >= 4).length;
  const percentage =
    reviews.length > 0
      ? Math.round((positiveCount / reviews.length) * 100)
      : 0;

  return `${profile.name} is an experienced ${profile.subcategory} based in ${profile.city}, ${profile.state}, with ${profile.years_experience} years of professional practice. ${percentage > 0 ? `${percentage}% of clients rate their experience positively, citing ${profile.specialties.slice(0, 2).join(" and ")} as standout strengths.` : `They specialize in ${profile.specialties.slice(0, 3).join(", ")}.`} Their Trust Score of ${profile.trust_score} reflects a strong reputation across multiple review platforms.`;
}
