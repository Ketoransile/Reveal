import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function POST(request: Request) {
    try {
        const { messages, analysisId } = await request.json();

        if (!messages || !analysisId) {
            return NextResponse.json({ error: 'Missing messages or analysisId' }, { status: 400 });
        }

        // Auth check
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch Analysis Context
        const { data: analysis, error: analysisError } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', analysisId)
            .single();

        if (analysisError || !analysis) {
            return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
        }

        // Fetch Report separately
        const { data: report, error: reportError } = await supabase
            .from('reports')
            .select('*')
            .eq('analysis_id', analysisId)
            .single();

        if (reportError || !report) {
            return NextResponse.json({ error: 'Report context not found' }, { status: 404 });
        }

        const context = `
CONTEXT:
Your Website: ${analysis.your_url}
Competitor Website: ${analysis.competitor_url}
Winner: ${report.winner}
Conversion Score: ${report.conversion_score}
Key Strengths: ${JSON.stringify(report.deep_analysis?.your_strengths || [])}
Competitor Advantages: ${JSON.stringify(report.deep_analysis?.competitor_strengths || [])}
Actionable Fixes: ${JSON.stringify(report.actionable_fixes || [])}
Traffic Insight: ${JSON.stringify(report.traffic_analysis || {})}
UX Insight: ${JSON.stringify(report.ux_insights || {})}
`;

        // Check for usage token
        const token = process.env["GITHUB_TOKEN"];
        let responseContent = "";

        if (token) {
            const endpoint = "https://models.github.ai/inference";
            const client = ModelClient(endpoint, new AzureKeyCredential(token));

            const systemMessage = {
                role: "system",
                content: `You are an expert competitive analysis consultant. 
Use the provided analysis data to answer the user's questions. 
Be specific, helpful, and encourage them to take action on the 'Actionable Fixes'.
Keep answers concise but informative.
${context}`
            };

            const response = await client.path("/chat/completions").post({
                body: {
                    messages: [systemMessage, ...messages],
                    model: "gpt-4o",
                    temperature: 0.7
                }
            });

            if (isUnexpected(response)) {
                throw response.body.error;
            }

            responseContent = response.body.choices[0].message.content || "I couldn't generate a response.";
        } else {
            // Fallback mock
            responseContent = "I'm in offline mode (no API token). Based on your analysis, I recommend focusing on the actionable fixes listed in your report.";
        }

        return NextResponse.json({ role: 'assistant', content: responseContent });

    } catch (error) {
        console.error('[CHAT API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
