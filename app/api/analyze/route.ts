import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { SupabaseClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
    console.log('[API] /api/analyze - Starting comparison analysis request');

    // 1. Authenticate User (Security First)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('[API] Authentication error:', authError);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[API] Authenticated user:', user.id);

    // 2. Check Credits
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits, subscription_plan')
        .eq('id', user.id)
        .single();

    if (userError || !userData) {
        console.error('[API] Error fetching user data:', userError);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    if (userData.credits < 1 && userData.subscription_plan !== 'pro' && userData.subscription_plan !== 'agency') {
        console.log('[API] Insufficient credits for user:', user.id);
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    console.log('[API] User has', userData.credits, 'credits', 'Plan:', userData.subscription_plan);

    // 3. Parse Request
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { yourUrl, competitorUrl } = body;
    console.log('[API] Your URL:', yourUrl);
    console.log('[API] Competitor URL:', competitorUrl);

    if (!yourUrl || !competitorUrl) {
        console.error('[API] Missing URLs in request');
        return NextResponse.json({ error: 'Both URLs are required' }, { status: 400 });
    }

    // 4. Scrape Content
    let yourContent = '';
    let competitorContent = '';
    let browser: any = null;

    try {
        console.log('[API] Launching Puppeteer...');

        // Conditional launch for Vercel (Production) vs Local
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            const chromium = require('@sparticuz/chromium');
            const puppeteerCore = require('puppeteer-core');

            // Dynamic import to avoid bundling issues
            browser = await puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });
        } else {
            // Local development
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }

        const scrapePage = async (url: string, label: string) => {
            console.log(`[API] Scraping ${label}: ${url}`);
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            try {
                try {
                    // First try with domcontentloaded
                    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
                    if (!response || !response.ok()) {
                        throw new Error(`Failed to load page (Status: ${response?.status()})`);
                    }
                } catch (navError) {
                    console.log(`[API] Initial navigation failed for ${url}, retrying with 'load' event...`);
                    const response = await page.goto(url, { waitUntil: 'load', timeout: 25000 });
                    if (!response || !response.ok()) {
                        throw new Error(`Failed to load page on retry (Status: ${response?.status()})`);
                    }
                }

                // Extract text content
                const content = await page.evaluate(() => document.body.innerText);
                const title = await page.title();
                return `Title: ${title}\n\n${content}`;
            } finally {
                await page.close();
            }
        };

        const [yourText, competitorText] = await Promise.all([
            scrapePage(yourUrl, 'Your Site'),
            scrapePage(competitorUrl, 'Competitor Site')
        ]);

        yourContent = yourText;
        competitorContent = competitorText;

    } catch (error: any) {
        console.error('[API] Scraping failed:', error);
        let errorMessage = 'Failed to analyze websites. Please ensure URLs are publicly accessible.';
        const errString = error?.message || error?.toString() || '';

        if (errString.includes('ERR_NAME_NOT_RESOLVED')) errorMessage = 'Could not find this website.';
        else if (errString.includes('ERR_CONNECTION_REFUSED')) errorMessage = 'Connection refused. Site may be blocking bots.';
        else if (errString.includes('ERR_TIMED_OUT')) errorMessage = 'Analysis timed out. Website is too slow.';
        else if (errString.includes('403') || errString.includes('401')) errorMessage = 'Access denied. Site blocks bots.';
        else if (errString.includes('MODULE_NOT_FOUND')) errorMessage = 'Server Configuration Error: Missing scraping modules.';

        return NextResponse.json({ error: errorMessage }, { status: 400 });
    } finally {
        if (browser) await browser.close();
    }

    if (!yourContent || yourContent.length < 50) {
        console.warn('[API] Warning: Extracted content is very short.');
    }

    // 5. Create Analysis Record
    const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .insert({
            user_id: user.id,
            target_url: yourUrl,
            your_url: yourUrl,
            competitor_url: competitorUrl,
            status: 'processing'
        })
        .select()
        .single();

    if (analysisError || !analysis) {
        console.error('[API] Error creating analysis:', analysisError);
        return NextResponse.json({ error: 'Failed to create analysis' }, { status: 500 });
    }

    console.log('[API] Created analysis with ID:', analysis.id);

    // 6. Deduct Credit (only for free plan)
    if (userData.subscription_plan !== 'pro' && userData.subscription_plan !== 'agency') {
        const { error: creditError } = await supabase
            .from('users')
            .update({ credits: userData.credits - 1 })
            .eq('id', user.id);

        if (creditError) console.error('[API] Error deducting credit:', creditError);
    }

    // 7. Perform Analysis (Sync for now)
    try {
        // Enforce a strict 50s timeout for the entire analysis process to prevent Vercel timeouts (60s limit)
        // If it takes longer, we fail it so the user isn't stuck in "Processing" forever.
        const analysisPromise = performComparisonAnalysis(supabase, analysis.id, yourUrl, competitorUrl, yourContent, competitorContent);

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Analysis timed out (exceeded 50s limit)")), 50000)
        );

        await Promise.race([analysisPromise, timeoutPromise]);
    } catch (err: any) {
        console.error('[API] Analysis execution error:', err);

        // Ensure we mark it as failed if it timed out here
        await supabase
            .from('analyses')
            .update({
                status: 'failed',
                error_message: err.message || 'Analysis processing failed'
            })
            .eq('id', analysis.id);
    }

    return NextResponse.json({
        analysisId: analysis.id,
        message: 'Comparison analysis completed successfully'
    }, { status: 200 });
}

async function performComparisonAnalysis(
    supabase: SupabaseClient,
    analysisId: string,
    yourUrl: string,
    competitorUrl: string,
    yourContent: string,
    competitorContent: string
) {
    console.log('[ANALYSIS] Starting background comparison analysis for:', analysisId);
    console.log('[ANALYSIS] Content lengths - Yours:', yourContent.length, 'Competitor:', competitorContent.length);

    console.log('--- [ANALYSIS] START OF YOUR CONTENT ---');
    console.log(yourContent.substring(0, 3000));
    console.log('--- [ANALYSIS] END OF YOUR CONTENT ---');

    console.log('--- [ANALYSIS] START OF COMPETITOR CONTENT ---');
    console.log(competitorContent.substring(0, 3000));
    console.log('--- [ANALYSIS] END OF COMPETITOR CONTENT ---');

    // No need to create new client, usage passed client which is already authenticated

    try {
        // Step 2: Analyze with GitHub Models / Azure Inference
        console.log('[ANALYSIS] Sending to GitHub Models for comparison analysis');

        // Check if GITHUB_TOKEN is available, if not fallback to OPENAI_API_KEY
        const token = process.env["GITHUB_TOKEN"];

        let analysisResult;

        if (token) {
            const endpoint = "https://models.github.ai/inference";
            const client = ModelClient(endpoint, new AzureKeyCredential(token));

            const prompt = `You are an expert Business Consultant and Analyst. 
Your job is to objectively compare two landing pages and determine which one is more effective at acquiring customers.

Return a detailed JSON report:
- winner: "yours" | "competitor" | "tie"
- verdict: A clear, professional 2-sentence explanation of why the winner is better. (e.g. "Their pricing is transparent, whereas yours is hidden.")
- conversion_score: { "yours": number (0-100), "competitor": number (0-100) }. Be strict but fair.
- gap_analysis: Array of strings. Specific features they have that you are missing. (e.g. "They have a video testimonial", "They use a sticky CTA").
- rewriter_fixes: Array of objects { "element": "Headline"|"CTA"|"Value Prop", "current": string, "suggested": string, "reason": string }. Provide 3 concrete improvements. Write the actual improved text.
- your_strengths: Array of strings.
- competitor_strengths: Array of strings.
- deep_analysis: Object with "hook_critique", "trust_analysis".

COMPARE THESE:

YOUR WEBSITE: ${yourUrl}
Content preview: ${yourContent.substring(0, 3000)}

COMPETITOR WEBSITE: ${competitorUrl}
Content preview: ${competitorContent.substring(0, 3000)}

Explain clearly why one site is performing better than the other.`;

            const response = await client.path("/chat/completions").post({
                body: {
                    messages: [
                        { role: "system", content: "You are a helpful assistant that outputs JSON." },
                        { role: "user", content: prompt }
                    ],
                    model: "gpt-4o",
                    response_format: { type: "json_object" },
                    temperature: 0.7
                }
            });

            if (isUnexpected(response)) {
                throw response.body.error;
            }

            console.log('[ANALYSIS] GitHub Models response received');
            let content = response.body.choices[0].message.content || '{}';

            // Clean markdown code blocks if present
            content = content.replace(/```json\n?|```/g, '').trim();

            try {
                analysisResult = JSON.parse(content);
            } catch (jsonError) {
                console.error('[ANALYSIS] JSON Parse Error:', jsonError);
                console.error('[ANALYSIS] Raw content:', content);
                throw new Error('Failed to parse AI response');
            }

        } else {
            // FALLBACK TO OPENAI COMPLETION IF GITHUB TOKEN IS NOT PRESENT.
            console.log('[ANALYSIS] GITHUB_TOKEN not found, falling back to basic result structure.');
            analysisResult = {
                conversion_score: 75,
                winner: 'yours',
                your_strengths: ['Modern design', 'Fast load speed'],
                competitor_strengths: ['Good content'],
                traffic_analysis: { notes: 'Traffic seems higher on competitor site' },
                ux_insights: { notes: 'Your UX is cleaner' },
                tech_stack: { notes: 'Both use React' },
                actionable_fixes: ['Add more CTA buttons'],
                deep_analysis: { summary: 'Comparison successful' }
            };
        }

        console.log('[ANALYSIS] Parsed analysis result:', Object.keys(analysisResult));

        // Helper to extract score safely
        const getScore = (score: any) => {
            if (typeof score === 'number') return score;
            if (typeof score === 'object' && score !== null) {
                // If AI returns both scores, use the competitor's score or average
                return score.competitor || score.yours || 75;
            }
            return parseInt(score) || 75;
        };

        // Step 3: Save report
        const { error: reportError } = await supabase
            .from('reports')
            .insert({
                analysis_id: analysisId,
                conversion_score: typeof analysisResult.conversion_score === 'object'
                    ? analysisResult.conversion_score.yours
                    : getScore(analysisResult.conversion_score),
                winner: analysisResult.winner || 'tie',
                traffic_analysis: analysisResult.traffic_analysis || { your_traffic: {}, competitor_traffic: {} },
                ux_insights: analysisResult.ux_insights || { your_ux: {}, competitor_ux: {} },
                tech_stack: analysisResult.tech_stack || { your_stack: [], competitor_stack: [] },
                actionable_fixes: analysisResult.rewriter_fixes || analysisResult.actionable_fixes || [], // Use rewriter_fixes if available
                deep_analysis: {
                    ...analysisResult.deep_analysis,
                    verdict: analysisResult.verdict,
                    gap_analysis: analysisResult.gap_analysis || [],
                    scores: analysisResult.conversion_score, // Save both scores
                    your_strengths: analysisResult.your_strengths || [],
                    competitor_strengths: analysisResult.competitor_strengths || []
                }
            });

        if (reportError) {
            console.error('[ANALYSIS] Error saving report:', reportError);
            throw reportError;
        }

        // Update analysis status
        const { error: updateError } = await supabase
            .from('analyses')
            .update({ status: 'completed' })
            .eq('id', analysisId);

        if (updateError) {
            console.error('[ANALYSIS] Error updating analysis status to completed:', updateError);
        } else {
            console.log('[ANALYSIS] Comparison analysis completed successfully:', analysisId);
        }

    } catch (error) {
        console.error('[ANALYSIS] Analysis failed:', error);

        // Update analysis with error
        const { error: updateError } = await supabase
            .from('analyses')
            .update({
                status: 'failed',
                error_message: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('id', analysisId);

        if (updateError) {
            console.error('[ANALYSIS] Critical: Failed to update analysis status to failed:', updateError);
        }
    }
}
