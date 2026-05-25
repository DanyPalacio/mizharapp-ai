/**
 * File Processing & Document Interpretation
 * Handles .doc, .pdf, .md, .ppt, .xls files
 * Interprets content for business plan generation
 */

import mammoth from 'mammoth'; // Word docs
import pdfParse from 'pdf-parse'; // PDFs
import ExcelJS from 'exceljs'; // Excel files
// PowerPoint parsing removed - no stable npm package available

export interface ProcessedFile {
  filename: string;
  filetype: string;
  content: string;
  extracted_data: Record<string, any>;
  metadata: {
    pages?: number;
    tables?: number;
    images?: number;
    slides?: number;
    cells?: number;
  };
}

export interface BusinessPlanExtraction {
  company_name?: string;
  mission?: string;
  vision?: string;
  industry?: string;
  target_market?: string;
  key_features?: string[];
  financial_data?: Record<string, any>;
  team_info?: Record<string, any>;
  competitive_advantages?: string[];
}

/**
 * Process different file types
 */
export class FileProcessor {
  /**
   * Process Word document (.docx, .doc)
   */
  static async processWordDocument(buffer: Buffer): Promise<ProcessedFile> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      return {
        filename: 'document.docx',
        filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: result.value,
        extracted_data: this.extractBusinessInfo(result.value),
        metadata: {
          pages: Math.ceil(result.value.split('\n').length / 50),
        },
      };
    } catch (error) {
      throw new Error(`Failed to process Word document: ${error}`);
    }
  }

  /**
   * Process PDF document
   */
  static async processPdfDocument(buffer: Buffer): Promise<ProcessedFile> {
    try {
      const pdf = await pdfParse(buffer);
      const content = pdf.text;

      return {
        filename: 'document.pdf',
        filetype: 'application/pdf',
        content,
        extracted_data: this.extractBusinessInfo(content),
        metadata: {
          pages: pdf.numpages,
          images: pdf.info?.Producer ? 1 : 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to process PDF: ${error}`);
    }
  }

  /**
   * Process Markdown document
   */
  static async processMarkdownDocument(buffer: Buffer): Promise<ProcessedFile> {
    try {
      const content = buffer.toString('utf-8');
      
      return {
        filename: 'document.md',
        filetype: 'text/markdown',
        content,
        extracted_data: this.extractBusinessInfo(content),
        metadata: {},
      };
    } catch (error) {
      throw new Error(`Failed to process Markdown: ${error}`);
    }
  }

  /**
   * Process Excel spreadsheet
   */
  static async processExcelDocument(buffer: Buffer): Promise<ProcessedFile> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);

      let content = '';
      const extractedData: Record<string, any> = {};
      let cellCount = 0;

      workbook.eachSheet((sheet) => {
        content += `\n## Sheet: ${sheet.name}\n`;
        
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            content += `${cell.value} | `;
            cellCount++;
          });
          content += '\n';
        });

        // Extract financial data if present
        if (sheet.name.toLowerCase().includes('financ')) {
          extractedData.financial_sheet = sheet.name;
        }
      });

      return {
        filename: 'document.xlsx',
        filetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        content,
        extracted_data: { ...extractedData, ...this.extractBusinessInfo(content) },
        metadata: {
          cells: cellCount,
        },
      };
    } catch (error) {
      throw new Error(`Failed to process Excel: ${error}`);
    }
  }

  /**
   * Process PowerPoint presentation
   */
  static async processPowerPointDocument(buffer: Buffer): Promise<ProcessedFile> {
    // PowerPoint parsing currently not supported
    // No stable npm package available for PPTX parsing
    throw new Error('PowerPoint file processing is not currently supported. Please convert to PDF or Word document.');
  }

  /**
   * Extract business information from content
   */
  static extractBusinessInfo(content: string): BusinessPlanExtraction {
    const extracted: BusinessPlanExtraction = {};

    // Extract company name
    const companyMatch = content.match(/(?:company|business|organization):\s*(.+?)(?:\n|;|$)/i);
    if (companyMatch) extracted.company_name = companyMatch[1].trim();

    // Extract mission
    const missionMatch = content.match(/mission:\s*(.+?)(?:\n|;|$)/i);
    if (missionMatch) extracted.mission = missionMatch[1].trim();

    // Extract vision
    const visionMatch = content.match(/vision:\s*(.+?)(?:\n|;|$)/i);
    if (visionMatch) extracted.vision = visionMatch[1].trim();

    // Extract industry
    const industryMatch = content.match(/(?:industry|sector):\s*(.+?)(?:\n|;|$)/i);
    if (industryMatch) extracted.industry = industryMatch[1].trim();

    // Extract target market
    const marketMatch = content.match(/(?:target market|market):\s*(.+?)(?:\n|;|$)/i);
    if (marketMatch) extracted.target_market = marketMatch[1].trim();

    // Extract features/products
    const featuresMatch = content.match(/(?:features|products|services):\s*(.+?)(?:\n\n|$)/i);
    if (featuresMatch) {
      extracted.key_features = featuresMatch[1]
        .split(/[,;]/)
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    }

    // Extract financial metrics
    const revenueMatch = content.match(/revenue:\s*\$?([\d,]+)/i);
    const burnRateMatch = content.match(/burn rate:\s*\$?([\d,]+)/i);
    const arcMatch = content.match(/arc:\s*\$?([\d,]+)/i);

    if (revenueMatch || burnRateMatch || arcMatch) {
      extracted.financial_data = {
        revenue: revenueMatch ? revenueMatch[1] : undefined,
        burn_rate: burnRateMatch ? burnRateMatch[1] : undefined,
        arc: arcMatch ? arcMatch[1] : undefined,
      };
    }

    // Extract competitive advantages
    const competitiveMatch = content.match(
      /(?:competitive advantage|advantage|moat):\s*(.+?)(?:\n\n|$)/i
    );
    if (competitiveMatch) {
      extracted.competitive_advantages = competitiveMatch[1]
        .split(/[,;]/)
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
    }

    return extracted;
  }

  /**
   * Process file based on type
   */
  static async processFile(file: File): Promise<ProcessedFile> {
    const buffer = await file.arrayBuffer();
    const buf = Buffer.from(buffer);
    const filetype = file.type;
    const filename = file.name;

    let processed: ProcessedFile;

    if (filetype.includes('word') || filename.endsWith('.docx') || filename.endsWith('.doc')) {
      processed = await this.processWordDocument(buf);
    } else if (filetype.includes('pdf') || filename.endsWith('.pdf')) {
      processed = await this.processPdfDocument(buf);
    } else if (filetype.includes('markdown') || filename.endsWith('.md')) {
      processed = await this.processMarkdownDocument(buf);
    } else if (
      filetype.includes('spreadsheet') ||
      filetype.includes('excel') ||
      filename.endsWith('.xlsx') ||
      filename.endsWith('.xls')
    ) {
      processed = await this.processExcelDocument(buf);
    } else if (
      filetype.includes('presentation') ||
      filetype.includes('powerpoint') ||
      filename.endsWith('.pptx') ||
      filename.endsWith('.ppt')
    ) {
      processed = await this.processPowerPointDocument(buf);
    } else {
      throw new Error(`Unsupported file type: ${filetype}`);
    }

    return {
      ...processed,
      filename,
      filetype,
    };
  }
}

/**
 * Generate business plan from extracted document data
 */
export function generateBusinessPlanFromDocument(
  extracted: BusinessPlanExtraction
): Record<string, any> {
  return {
    company: {
      name: extracted.company_name || 'Unnamed Company',
      mission: extracted.mission || 'Not specified',
      vision: extracted.vision || 'Not specified',
    },
    market: {
      industry: extracted.industry || 'Unknown',
      target_market: extracted.target_market || 'Not specified',
    },
    product: {
      key_features: extracted.key_features || [],
      competitive_advantages: extracted.competitive_advantages || [],
    },
    financials: extracted.financial_data || {},
    team: extracted.team_info || {},
  };
}
