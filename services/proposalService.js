import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProposalService {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async captureScreenshots(kols) {
    await this.initialize();
    const screenshots = {};

    for (const kol of kols) {
      const page = await this.browser.newPage();
      try {
        // Set viewport to a reasonable mobile/desktop size
        await page.setViewport({ width: 1280, height: 800 });

        // Determine which URL to screenshot (prioritize Instagram, then TikTok)
        const url = kol.instagram || kol.tiktok || kol.facebook;

        if (url) {
          console.log(`Screenshotting ${kol.name} at ${url}`);
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

          // Wait for 5 seconds to ensure dynamic content loads
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Take screenshot
          const buffer = await page.screenshot({ encoding: 'base64' });
          screenshots[kol.id] = `data:image/png;base64,${buffer}`;
        } else {
          screenshots[kol.id] = null; // Placeholder or default image
        }
      } catch (error) {
        console.error(`Error screenshotting ${kol.name}:`, error);
        screenshots[kol.id] = null;
      } finally {
        await page.close();
      }
    }

    return screenshots;
  }

  async generateProposal(companyName, kols) {
    try {
      // 1. Capture screenshots
      const screenshots = await this.captureScreenshots(kols);

      // 2. Prepare data for template
      const data = {
        companyName,
        kols: kols.map(kol => ({
          ...kol,
          screenshot: screenshots[kol.id],
          // Format currency
          formattedRate: new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(kol.rate)
        })),
        generatedDate: new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })
      };

      // 3. Load and compile template
      // We'll assume the template is in the same directory for now
      const templatePath = path.join(__dirname, 'templates', 'proposal.html');

      // Check if template exists, if not use a default string (for now)
      let templateContent;
      try {
        templateContent = await fs.readFile(templatePath, 'utf-8');
      } catch (e) {
        console.warn('Template file not found, using default template.');
        templateContent = this.getDefaultTemplate();
      }

      const template = handlebars.compile(templateContent);
      const html = template(data);

      // 4. Generate PDF
      const page = await this.browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }
      });

      await page.close();
      return pdfBuffer;

    } catch (error) {
      console.error('Error generating proposal:', error);
      throw error;
    }
  }

  getDefaultTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { color: #d32f2f; font-size: 24px; }
          .header h2 { font-size: 18px; color: #555; }
          .section-title { background-color: #000; color: #fff; padding: 10px; font-weight: bold; margin-top: 20px; }
          .kol-card { display: flex; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; page-break-inside: avoid; }
          .kol-info { flex: 1; padding-right: 20px; }
          .kol-screenshot { flex: 1; }
          .kol-screenshot img { max-width: 100%; border: 1px solid #ddd; }
          .label { font-weight: bold; color: #666; }
          .value { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PROPOSAL</h1>
          <h2>PROPOSED TO : {{companyName}}</h2>
          <p>Date: {{generatedDate}}</p>
        </div>

        <div class="section-title">CADANGAN KAMI</div>

        {{#each kols}}
        <div class="kol-card">
          <div class="kol-info">
            <h3>{{name}}</h3>
            <div class="label">Platform</div>
            <div class="value">
              {{#if instagram}}Instagram {{/if}}
              {{#if tiktok}}TikTok {{/if}}
            </div>
            
            <div class="label">Niche</div>
            <div class="value">
              {{#each niches}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
            </div>

            <div class="label">Rate</div>
            <div class="value">{{formattedRate}}</div>

            <div class="label">Details</div>
            <div class="value">{{rateDetails}}</div>
          </div>
          <div class="kol-screenshot">
            {{#if screenshot}}
              <img src="{{screenshot}}" alt="Profile Screenshot" />
            {{else}}
              <div style="background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center;">
                No Screenshot Available
              </div>
            {{/if}}
          </div>
        </div>
        {{/each}}
      </body>
      </html>
    `;
  }
}

export default new ProposalService();
