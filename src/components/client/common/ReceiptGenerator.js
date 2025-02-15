import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReceiptGenerator = {
  generate: (bookingData, paymentData) => {
    const doc = new jsPDF();
    
    const primaryColor = [139, 0, 0];
    const secondaryColor = [60, 60, 60];
    const lightGrey = [128, 128, 128];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 220, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('DOMICILE HOTELS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('LUXURY STAYS', 105, 30, { align: 'center' });

    // Receipt Title
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(18);
    doc.text('PAYMENT RECEIPT', 105, 55, { align: 'center' });

    // Receipt Details
    doc.setFontSize(10);
    doc.setTextColor(...lightGrey);
    doc.text(`Receipt No: ${bookingData.id}`, 15, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 65, { align: 'right' });

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 70, 195, 70);

    // Guest Information
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Guest Information', 15, 85);

    const guestInfo = [
      ['Guest Name:', bookingData.fullName],
      ['Email:', bookingData.email],
      ['Contact:', bookingData.contactNumber],
      ['Address:', bookingData.address]
    ];

    doc.autoTable({
      startY: 90,
      head: [],
      body: guestInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Booking Details
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Booking Details', 15, doc.autoTable.previous.finalY + 15);

    const calculateNights = () => {
      return Math.ceil(
        Math.abs(new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / 
        (1000 * 60 * 60 * 24)
      );
    };

    const bookingDetails = [
      ['Room Type:', bookingData.roomName],
      ['Check-in:', new Date(bookingData.checkInDate).toLocaleDateString()],
      ['Check-out:', new Date(bookingData.checkOutDate).toLocaleDateString()],
      ['Number of Nights:', calculateNights()],
      ['Room Capacity:', `${bookingData.capacity} Persons`],
      ['Bed Type:', bookingData.bedType],
      ['View:', bookingData.view]
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [],
      body: bookingDetails,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Payment Details
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Payment Details', 15, doc.autoTable.previous.finalY + 15);

    const paymentDetails = [
      ['Payment ID:', paymentData.id],
      ['Payment Status:', 'Paid'],
      ['Room Rate per Night:', `$${bookingData.totalAmount / calculateNights()}`],
      ['Total Amount Paid:', `$${bookingData.totalAmount}`]
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [],
      body: paymentDetails,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 30;
    const currentY = doc.autoTable.previous.finalY;
    
    if (currentY + footerHeight > pageHeight - 20) {
      doc.addPage();
      const footerY = 20;
      addFooter(doc, footerY, lightGrey);
    } else {
      const footerY = currentY + 20;
      addFooter(doc, footerY, lightGrey);
    }

    return doc;
  },

  download: (bookingData, paymentData) => {
    const doc = ReceiptGenerator.generate(bookingData, paymentData);
    const fileName = `DomicileHotels_Receipt_${bookingData.id}.pdf`;
    doc.save(fileName);
  }
};

// Helper function to add footer
const addFooter = (doc, footerY, lightGrey) => {
  doc.setDrawColor(...lightGrey);
  doc.setLineWidth(0.2);
  doc.line(15, footerY, 195, footerY);

  doc.setFontSize(8);
  doc.setTextColor(...lightGrey);
  doc.text('Thank you for choosing Domicile Hotels', 105, footerY + 5, { align: 'center' });
  doc.text('123 Luxury Avenue, Pretoria, South Africa', 105, footerY + 10, { align: 'center' });
  doc.text('Tel: +27 12 345 6789 | Email: info@domicilehotels.com', 105, footerY + 15, { align: 'center' });
};

export default ReceiptGenerator; 