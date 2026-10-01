import jsPDF from 'jspdf';
import { CertificateRecord, InstitutionScoreBreakdown, DatabaseState } from '../types';

export class ExportService {
  /**
   * Generates and downloads a CSV file from an array of JSON objects
   */
  public static exportToCsv(data: Record<string, any>[], filename: string): void {
    if (!data || !data.length) {
      alert('No data available to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const str = Array.isArray(val) ? val.join('; ') : String(val);
        const escaped = str.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Generates a formal Institutional Innovation PDF Report
   */
  public static generateInstitutionPdfReport(
    institutionName: string,
    scoreBreakdown: InstitutionScoreBreakdown,
    db: DatabaseState
  ): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('MINISTRY OF AYUSH — GOVERNMENT OF INDIA', pageWidth / 2, 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('InnovateIQ — National Portal for Innovation Excellence Indicators', pageWidth / 2, 18, { align: 'center' });
    doc.text(`Official Institutional Performance & Indicator Report — ${new Date().toLocaleDateString()}`, pageWidth / 2, 23, { align: 'center' });

    // Institution Info
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(institutionName, 14, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporting Period: Academic Year 2025–2026 | Verified Records: ${scoreBreakdown.totalApprovedRecords}`, 14, 46);

    // Score Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 52, pageWidth - 28, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('COMPOSITE INSTITUTIONAL INNOVATION SCORE', 20, 61);

    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(`${scoreBreakdown.overallScore.toFixed(1)} / 100`, pageWidth - 45, 66);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Calculated across ${scoreBreakdown.totalIndicators} weighted ministerial innovation indicators.`, 20, 68);

    // Table Header
    let yPos = 84;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos, pageWidth - 28, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('Indicator Name', 16, yPos + 5.5);
    doc.text('Weight', 115, yPos + 5.5);
    doc.text('Target', 135, yPos + 5.5);
    doc.text('Actual', 152, yPos + 5.5);
    doc.text('Achieved %', 170, yPos + 5.5);

    yPos += 10;

    // Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    for (const item of scoreBreakdown.results) {
      doc.setTextColor(30, 41, 59);
      // Truncate long indicator names to fit
      const shortName = item.name.length > 55 ? item.name.substring(0, 52) + '...' : item.name;
      doc.text(shortName, 16, yPos);
      doc.text(`${item.weight}%`, 115, yPos);
      doc.text(`${item.target}`, 135, yPos);
      doc.text(`${item.actual}`, 152, yPos);
      doc.text(`${item.achievementPercentage.toFixed(1)}%`, 170, yPos);

      // hairline divider
      doc.setDrawColor(241, 245, 249);
      doc.line(14, yPos + 2.5, pageWidth - 14, yPos + 2.5);
      yPos += 7;
    }

    // Summary Statistics Section
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Institutional Innovation Portfolio Summary', 14, yPos);

    yPos += 8;
    const portfolioStats = [
      `Active Innovation Projects: ${db.projects.length} (${db.projects.filter(p => p.verificationStatus === 'approved').length} Verified)`,
      `Patents Filed & Granted: ${db.patents.length} (${db.patents.filter(p => p.status === 'Granted').length} Granted)`,
      `Peer-Reviewed Publications: ${db.publications.length} (SCI/Scopus: ${db.publications.filter(p => p.indexing === 'SCI' || p.indexing === 'Scopus').length})`,
      `Research Grants Sanctioned: ₹${db.grants.reduce((s, g) => s + (g.amount || 0), 0).toFixed(1)} Lakhs`,
      `Startups Incubated: ${db.startups.length} | Hackathons/Competitions Won: ${db.competitions.length}`
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    for (const stat of portfolioStats) {
      doc.text(`• ${stat}`, 16, yPos);
      yPos += 6;
    }

    // Footer
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 275, pageWidth - 14, 275);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('InnovateIQ — Autonomous Verification & Indicator Intelligence Platform', 14, 281);
    doc.text('Page 1 of 1', pageWidth - 28, 281);

    doc.save(`AYUSH_Innovation_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  /**
   * Generates a digital certificate of Innovation Excellence
   */
  public static generateCertificatePdf(cert: CertificateRecord): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Outer double border
    doc.setDrawColor(180, 83, 9); // amber-700 / gold
    doc.setLineWidth(1.5);
    doc.rect(10, 10, width - 20, height - 20);

    doc.setDrawColor(15, 23, 42); // slate-900
    doc.setLineWidth(0.5);
    doc.rect(13, 13, width - 26, height - 26);

    // Decorative corner blocks
    doc.setFillColor(180, 83, 9);
    doc.rect(10, 10, 8, 8, 'F');
    doc.rect(width - 18, 10, 8, 8, 'F');
    doc.rect(10, height - 18, 8, 8, 'F');
    doc.rect(width - 18, height - 18, 8, 8, 'F');

    // Header Emblem text
    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('MINISTRY OF AYUSH · GOVERNMENT OF INDIA', width / 2, 26, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('CENTRAL PORTAL FOR INNOVATION EXCELLENCE INDICATORS', width / 2, 31, { align: 'center' });

    // Main Certificate Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.text('CERTIFICATE OF INNOVATION EXCELLENCE', width / 2, 47, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('This is formally conferred upon', width / 2, 57, { align: 'center' });

    // Recipient Name
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text(cert.recipientName, width / 2, 71, { align: 'center' });

    // Recipient affiliation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`${cert.recipientRole} · ${cert.institutionName}`, width / 2, 78, { align: 'center' });

    // Citation Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text('in recognition of outstanding scientific contribution and verified achievement in:', width / 2, 90, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(180, 83, 9);
    doc.text(`"${cert.achievementTitle}"`, width / 2, 100, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${cert.category} | Verified Record under National AYUSH Innovation Framework`, width / 2, 108, { align: 'center' });

    // Signatures & Verification metadata
    const sigY = 150;

    // Left: Date & Certificate ID
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Certificate No: ${cert.certificateNumber}`, 30, sigY + 5);
    doc.text(`Date of Issue: ${cert.issueDate}`, 30, sigY + 11);
    doc.text('Digital Verification: https://ayush.gov.in/verify', 30, sigY + 17);

    // Right: Authorized Signatory
    doc.setDrawColor(148, 163, 184);
    doc.line(width - 90, sigY + 4, width - 30, sigY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(cert.authorizedSignatory, width - 60, sigY + 9, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(cert.signatoryTitle, width - 60, sigY + 14, { align: 'center' });
    doc.text('Institutional Innovation Review Board', width - 60, sigY + 19, { align: 'center' });

    doc.save(`Innovation_Certificate_${cert.certificateNumber}.pdf`);
  }
}
