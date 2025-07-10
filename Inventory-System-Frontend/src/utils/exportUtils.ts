import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to format numbers as currency (PHP)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

// Function to export data to CSV
export const exportToCSV = (data: any[], filename: string = 'export'): void => {
  if (data.length === 0) {
    console.warn('No data to export.');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => JSON.stringify(row[header])).join(',')
    )
  ];
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Function to export a DOM element to PDF
export const exportToPDF = (elementId: string, filename: string = 'export'): void => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  html2canvas(input, { scale: 2 })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight >= pdfWidth / pdfHeight ? pdfWidth / imgWidth : pdfHeight / imgHeight;
      const canvasWidth = imgWidth * ratio;
      const canvasHeight = imgHeight * ratio;

      const marginX = (pdfWidth - canvasWidth) / 2;
      const marginY = (pdfHeight - canvasHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
      pdf.save(`${filename}.pdf`);
    });
};
