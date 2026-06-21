import jsPDF from 'jspdf';
import enData from '@/locales/en.json';
import alData from '@/locales/al.json';
import mkData from '@/locales/mk.json';

const locales = {
  en: enData,
  al: alData,
  sq: alData,
  mk: mkData
};

export const generatePartnerAgreementPDF = (language = 'en') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      const data = locales[language] || locales.en;
      const agreement = data.partnerAgreement;

      // Colors
      const navy = '#1a2a4a';
      const gold = '#d4af37';
      const darkGray = '#333333';
      const textGray = '#4a4a4a';

      // Header Background
      doc.setFillColor(navy);
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Title
      doc.setTextColor(gold);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(agreement.title || "Partner Store Agreement", margin, 25);

      yPosition = 50;

      // Meta info
      doc.setTextColor(darkGray);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${agreement.version} | ${agreement.effectiveDate}`, margin, yPosition);
      yPosition += 15;

      // Separator
      doc.setDrawColor(gold);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      yPosition += 10;

      // Sections
      const sections = agreement.sections;
      
      doc.setFontSize(11);

      sections.forEach((section, index) => {
        // Check for page break
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
          
          // Header on new page (smaller)
          doc.setFillColor(navy);
          doc.rect(0, 0, pageWidth, 15, 'F');
          yPosition += 20;
        }

        // Section Title
        doc.setTextColor(navy);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin, yPosition);
        yPosition += 7;

        // Section Content
        doc.setTextColor(textGray);
        doc.setFont('helvetica', 'normal');
        
        // Split text to fit width
        const splitText = doc.splitTextToSize(section.content, contentWidth);
        doc.text(splitText, margin, yPosition);
        
        yPosition += (splitText.length * 5) + 10;
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Occasions Gifts Partner Agreement`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      // Return Blob
      const blob = doc.output('blob');
      resolve(blob);

    } catch (error) {
      reject(error);
    }
  });
};