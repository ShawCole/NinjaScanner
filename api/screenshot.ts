import { NextRequest, NextResponse } from 'next/server';
import playwright from 'playwright-core';

export const config = {
    runtime: 'edge',
};

// Validate URL to prevent XSS and ensure it's a proper web URL
function validateUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}

export default async function handler(req: NextRequest) {
    if (req.method !== 'GET') {
        return new NextResponse('Method not allowed', { status: 405 });
    }

    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    if (!validateUrl(url)) {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 422 });
    }

    try {
        // Launch Chromium with optimized settings for serverless
        const browser = await playwright.chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1440,900'
            ]
        });

        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        const page = await context.newPage();

        // Set timeout and wait conditions
        page.setDefaultTimeout(10000);
        page.setDefaultNavigationTimeout(10000);

        // Navigate to the URL with network idle wait
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 10000
        });

        // Wait a bit more for any lazy-loaded content
        await page.waitForTimeout(2000);

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: 85,
            fullPage: false // Only capture viewport, not full page
        });

        await browser.close();

        // Convert to base64 for JSON response
        const base64Screenshot = Buffer.from(screenshot).toString('base64');

        return NextResponse.json({
            screenshot: `data:image/jpeg;base64,${base64Screenshot}`,
            url: url,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Screenshot capture error:', error);

        return NextResponse.json({
            error: 'Failed to capture screenshot',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 