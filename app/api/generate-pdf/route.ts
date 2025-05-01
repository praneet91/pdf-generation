import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { z } from 'zod';
import { Readable } from 'stream';

const requestSchema = z.object({
  url: z.string().url(),
}).strict();

export async function POST(req: NextRequest) {
  let browser;
  try {
    const body = await req.json();
    
    // Validate request body
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const unexpectedProps = errors
        .filter((err) => err.code === 'unrecognized_keys')
        .map((err) => err.path.map(String).join('.'));
      
      if (unexpectedProps.length > 0) {
        return NextResponse.json(
          { error: `Unexpected property: ${unexpectedProps.join(', ')}` },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { url } = validationResult.data;
    const browserlessToken = process.env.BROWSERLESS_TOKEN;

    if (!browserlessToken) {
      return NextResponse.json(
        { error: 'Browserless token not configured' },
        { status: 500 }
      );
    }

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();
    
    // Set timeouts
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the URL and wait for network to be idle
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Generate PDF with optimized settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      preferCSSPageSize: true,
      timeout: 30000,
      scale: 0.8,
    });

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'attachment; filename="generated.pdf"');

    // Create a ReadableStream from the buffer
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdfBuffer);
        controller.close();
      },
    });

    return new Response(stream, {
      headers,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF. The page might be too large or taking too long to load.' },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
} 