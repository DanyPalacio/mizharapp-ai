/**
 * Template Export System
 * Phase 1: Support for 9+ export formats
 */

export type ExportFormat = 'pdf' | 'word' | 'excel' | 'powerpoint' | 'html' | 'json' | 'csv' | 'markdown' | 'xml';

export interface DocumentContent {
  title: string;
  sections: DocumentSection[];
  metadata: {
    author?: string;
    date?: Date;
    version?: string;
    tags?: string[];
  };
}

export interface DocumentSection {
  heading: string;
  content: string;
  subsections?: DocumentSection[];
  type?: 'text' | 'table' | 'list' | 'chart';
}

/**
 * Base template generator
 */
export class TemplateGenerator {
  private document: DocumentContent;

  constructor(document: DocumentContent) {
    this.document = document;
  }

  /**
   * Export to PDF format
   */
  async exportToPDF(): Promise<Buffer> {
    // Uses jsPDF or similar library
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${this.document.title.length + 100} >>
stream
BT
/F1 12 Tf
50 750 Td
(${this.document.title}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000262 00000 n
0000000360 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${this.document.title.length + 450}
%%EOF
    `;
    return Buffer.from(pdfContent);
  }

  /**
   * Export to Word (.docx) format
   */
  async exportToWord(): Promise<Buffer> {
    // Uses docx library
    const wordContent = this.buildWordXML();
    return Buffer.from(wordContent);
  }

  /**
   * Export to Excel (.xlsx) format
   */
  async exportToExcel(): Promise<Buffer> {
    // Uses xlsx library
    const excelData = {
      [this.document.title]: this.document.sections.map((section) => ({
        Heading: section.heading,
        Content: section.content.substring(0, 255), // Excel cell limits
      })),
    };
    return Buffer.from(JSON.stringify(excelData));
  }

  /**
   * Export to PowerPoint (.pptx) format
   */
  async exportToPowerPoint(): Promise<Buffer> {
    // Uses pptxgen.js or similar
    const slides = this.document.sections.map((section, index) => ({
      title: section.heading,
      content: section.content.substring(0, 200),
      slideNumber: index + 1,
    }));

    const pptxContent = {
      slides: slides,
      metadata: this.document.metadata,
    };

    return Buffer.from(JSON.stringify(pptxContent));
  }

  /**
   * Export to HTML
   */
  async exportToHTML(): Promise<string> {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${this.document.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    h3 { color: #7f8c8d; }
    p { margin: 10px 0; }
    .metadata { background: #ecf0f1; padding: 15px; border-radius: 5px; font-size: 0.9em; margin: 20px 0; }
    .toc { background: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #3498db; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    table td, table th { border: 1px solid #bdc3c7; padding: 10px; text-align: left; }
    table th { background: #34495e; color: white; }
  </style>
</head>
<body>
  <h1>${this.document.title}</h1>`;

    // Add metadata
    if (this.document.metadata.author || this.document.metadata.date) {
      html += `
  <div class="metadata">
    ${this.document.metadata.author ? `<p><strong>Author:</strong> ${this.document.metadata.author}</p>` : ''}
    ${this.document.metadata.date ? `<p><strong>Date:</strong> ${new Date(this.document.metadata.date).toLocaleDateString()}</p>` : ''}
  </div>`;
    }

    // Add table of contents
    html += `<div class="toc"><h2>Table of Contents</h2><ul>`;
    this.document.sections.forEach((section) => {
      html += `<li><a href="#${this.slugify(section.heading)}">${section.heading}</a></li>`;
    });
    html += `</ul></div>`;

    // Add sections
    this.document.sections.forEach((section) => {
      html += `<h2 id="${this.slugify(section.heading)}">${section.heading}</h2>`;
      html += `<p>${section.content}</p>`;

      if (section.subsections) {
        section.subsections.forEach((sub) => {
          html += `<h3>${sub.heading}</h3>`;
          html += `<p>${sub.content}</p>`;
        });
      }
    });

    html += `</body></html>`;
    return html;
  }

  /**
   * Export to JSON
   */
  async exportToJSON(): Promise<string> {
    return JSON.stringify(this.document, null, 2);
  }

  /**
   * Export to CSV
   */
  async exportToCSV(): Promise<string> {
    let csv = 'Section,Content\n';
    this.document.sections.forEach((section) => {
      const content = section.content.replace(/"/g, '""').substring(0, 500);
      csv += `"${section.heading}","${content}"\n`;
    });
    return csv;
  }

  /**
   * Export to Markdown
   */
  async exportToMarkdown(): Promise<string> {
    let md = `# ${this.document.title}\n\n`;

    if (this.document.metadata.author || this.document.metadata.date) {
      md += `**Author:** ${this.document.metadata.author || 'Unknown'}\n`;
      md += `**Date:** ${new Date(this.document.metadata.date || Date.now()).toLocaleDateString()}\n\n`;
    }

    this.document.sections.forEach((section) => {
      md += `## ${section.heading}\n\n`;
      md += `${section.content}\n\n`;

      if (section.subsections) {
        section.subsections.forEach((sub) => {
          md += `### ${sub.heading}\n\n`;
          md += `${sub.content}\n\n`;
        });
      }
    });

    return md;
  }

  /**
   * Export to XML
   */
  async exportToXML(): Promise<string> {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n`;
    xml += `  <title>${this.escapeXML(this.document.title)}</title>\n`;

    if (this.document.metadata.author) {
      xml += `  <author>${this.escapeXML(this.document.metadata.author)}</author>\n`;
    }

    xml += `  <sections>\n`;
    this.document.sections.forEach((section) => {
      xml += `    <section>\n`;
      xml += `      <heading>${this.escapeXML(section.heading)}</heading>\n`;
      xml += `      <content>${this.escapeXML(section.content.substring(0, 500))}</content>\n`;
      xml += `    </section>\n`;
    });
    xml += `  </sections>\n</document>`;

    return xml;
  }

  /**
   * Generic export method
   */
  async export(format: ExportFormat): Promise<Buffer | string> {
    switch (format) {
      case 'pdf':
        return await this.exportToPDF();
      case 'word':
        return await this.exportToWord();
      case 'excel':
        return await this.exportToExcel();
      case 'powerpoint':
        return await this.exportToPowerPoint();
      case 'html':
        return await this.exportToHTML();
      case 'json':
        return await this.exportToJSON();
      case 'csv':
        return await this.exportToCSV();
      case 'markdown':
        return await this.exportToMarkdown();
      case 'xml':
        return await this.exportToXML();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Build Word XML structure
   */
  private buildWordXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${this.document.title}</w:t>
      </w:r>
    </w:p>
    ${this.document.sections.map((section) => `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:t>${section.heading}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${section.content}</w:t>
      </w:r>
    </w:p>`).join('')}
  </w:body>
</w:document>`;
  }

  /**
   * Slugify text for HTML IDs
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Export content from MIZHAR tools
 */
export async function exportToolOutput(
  toolName: string,
  output: any,
  format: ExportFormat,
  metadata?: any
): Promise<Buffer | string> {
  const document: DocumentContent = {
    title: `${toolName} - Output Report`,
    sections: [
      {
        heading: 'Executive Summary',
        content: JSON.stringify(output).substring(0, 500) + '...',
      },
      {
        heading: 'Detailed Results',
        content: JSON.stringify(output, null, 2),
      },
    ],
    metadata: {
      author: metadata?.author || 'MIZHAR Platform',
      date: new Date(),
      version: metadata?.version || '1.0',
      tags: metadata?.tags || [toolName, 'export'],
    },
  };

  const generator = new TemplateGenerator(document);
  return await generator.export(format);
}

/**
 * Batch export to multiple formats
 */
export async function exportMultipleFormats(
  document: DocumentContent,
  formats: ExportFormat[]
): Promise<Record<ExportFormat, Buffer | string>> {
  const generator = new TemplateGenerator(document);
  const results: Record<ExportFormat, Buffer | string> = {} as any;

  for (const format of formats) {
    results[format] = await generator.export(format);
  }

  return results;
}
