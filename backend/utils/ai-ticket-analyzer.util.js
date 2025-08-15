import { createAgent, gemini } from "@inngest/agent-kit";
import dotenv from "dotenv"

dotenv.config()

// # This is an utility to be used by us in the functions inside inngest.

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({ 
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY
    }),
    name: "AI Ticket Triage Assistant",
    system: `
You are an expert AI assistant that processes techincal support tickets.

Your Job is to:
1. Summarize the reported issue in a clear and concise way.
2. Estimate the priority level of the ticket.
3. Provide helpful notes along with resource links for human moderators to review.
4. List the technical skills that would be useful for resolving the issue.

IMPORTANT: 
- Respond with *only* valid raw JSON.
- Do Not include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object - nothing else.
REPEAT: Only respond with valid raw JSON. No markdown. No code fences. No explanations. No extra formatting.
    `,
  });
  // Note:- The system prompt is a must, and is the important one, but at the moment we're calling the AI agent, even then we need to provide the prompts. 
  const response =
    await supportAgent.run(`You are a ticket triage agent.
Only return a strict JSON object with no extra text, header or markdown.

Analyze the following support ticket and provide a JSON object with:
- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium" or "high"
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful internal or external links, if possible.
- relatedSkills: An array of relevant skills required to solve the ticket issue(e.g., ["React","MongoDB"] ). 

Respond ONLY in this JSOn format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are the useful tips....",
"relatedSkills": "['React', 'Node.js']"
}
-------------
Ticket Information:
- Title: ${ticket.title}
- Description: ${ticket.description}`);

const rawData = response?.output?.[0]?.content;
// console.log("Raw Data: ",rawData);


try {
  if(rawData)
  {
    const match = rawData.match(/```json\s*([\s\S]*?)\s*```/i);
    // console.log("Match: ",match ? match[1] : "No match found!");
    const jsonString = match ? match[1] : rawData;
    const cleanString = jsonString.trim();
    return JSON.parse(cleanString);

  }

    
} catch (e) {
    console.error("Failed to parse JSON from AI response " + e.message)
    return null
}
};


export default analyzeTicket