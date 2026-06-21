import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateGiftCardPDF = async (elementId, cardDetails) => {
  const cardElement = document.getElementById(elementId);
  if (!cardElement) {
    console.error("PDF generation failed: Element not found.");
    return;
  }

  try {
    const canvas = await html2canvas(cardElement, {
      scale: 3, // Increase resolution for better quality
      backgroundColor: null, // Use transparent background
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in A4 Landscape
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Add a title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor('#1a2a4a');
    pdf.text('Your Occasions Gift Card', pdfWidth / 2, margin + 10, { align: 'center' });
    
    // Add instructions
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor('#333');
    pdf.text('You can print and fold this page to create a physical gift card.', pdfWidth / 2, margin + 20, { align: 'center' });


    // Dimensions of the card image (A7 size is roughly 105x74 mm)
    const cardWidth = 105;
    const cardHeight = cardWidth * (canvas.height / canvas.width);

    // Position the card image in the center
    const x = (pdfWidth - cardWidth) / 2;
    const y = (pdfHeight - cardHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

    // Add a dotted line for cutting
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setDrawColor(150, 150, 150);
    pdf.rect(x - 5, y - 5, cardWidth + 10, cardHeight + 10);
    
    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Occasions_GiftCard_${cardDetails.amount}EUR_${cardDetails.code}_${dateStr}.pdf`;

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};