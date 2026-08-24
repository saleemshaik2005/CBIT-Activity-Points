import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserProfile, StudentSubmission, ActivityCategory } from '@/types';
import { CBIT_24_CATEGORIES, CBIT_COLLEGE_NAME, CBIT_COLLEGE_CODE, MAR_DOCUMENT_TITLE } from './mar-constants';

export function generateOfficialCBITMARPDF(
  student: UserProfile,
  submissions: StudentSubmission[],
  categories: ActivityCategory[] = CBIT_24_CATEGORIES
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(CBIT_COLLEGE_NAME, pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(10);
  doc.text(CBIT_COLLEGE_CODE, pageWidth / 2, 19, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(MAR_DOCUMENT_TITLE, pageWidth / 2, 25, { align: 'center' });

  // Student Info Header Box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.rect(14, 28, pageWidth - 28, 12);
  
  doc.text(`Name of the student:`, 16, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(student.full_name || 'N/A', 52, 33);

  doc.setFont('helvetica', 'bold');
  doc.text(`Department:`, pageWidth / 2 + 10, 33);
  doc.setFont('helvetica', 'normal');
  doc.text(student.department || 'N/A', pageWidth / 2 + 35, 33);

  doc.setFont('helvetica', 'bold');
  doc.text(`Roll number:`, 16, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(student.roll_number || 'N/A', 52, 38);

  doc.setFont('helvetica', 'bold');
  doc.text(`Batch:`, pageWidth / 2 + 10, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(student.batch_year || '2024-2028', pageWidth / 2 + 35, 38);

  // Group approved submissions by Category SNo and Semester
  const semPointsMatrix: { [sno: number]: { [sem: number]: number } } = {};
  for (let i = 1; i <= 24; i++) {
    semPointsMatrix[i] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  }

  submissions
    .filter(s => s.status === 'approved')
    .forEach(s => {
      const cat = categories.find(c => c.id === s.category_id);
      const sno = cat ? cat.sno : 1;
      const pts = s.awarded_points || s.claimed_points || 0;
      if (s.semester >= 1 && s.semester <= 8 && semPointsMatrix[sno]) {
        semPointsMatrix[sno][s.semester] = (semPointsMatrix[sno][s.semester] || 0) + pts;
      }
    });

  // Prepare table rows matching the 24 rows in CBIT document
  const tableRows: any[] = [];
  let grandTotalPoints = 0;
  const semTotals: { [sem: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

  const uniqueSnoList = Array.from(new Set(categories.map(c => c.sno))).sort((a, b) => a - b);

  uniqueSnoList.forEach(sno => {
    const matchingCats = categories.filter(c => c.sno === sno);
    const primaryCat = matchingCats[0];
    const catPoints = semPointsMatrix[sno] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    
    let rowTotal = 0;
    for (let sem = 1; sem <= 8; sem++) {
      rowTotal += catPoints[sem];
      semTotals[sem] += catPoints[sem];
    }
    // Cap at max allowed
    const cappedRowTotal = Math.min(rowTotal, primaryCat.max_points_allowed);
    grandTotalPoints += cappedRowTotal;

    const subTypesText = matchingCats.map(c => 
      c.sub_type && c.sub_type !== 'General' ? `${c.sub_type} (${c.default_points} pts)` : `${c.default_points} pts`
    ).join(' / ');

    tableRows.push([
      sno.toString(),
      primaryCat.name + (matchingCats.length > 1 ? `\n[${subTypesText}]` : ''),
      matchingCats.map(c => c.default_points).join('/'),
      primaryCat.max_points_allowed.toString(),
      catPoints[1] ? catPoints[1].toString() : '',
      catPoints[2] ? catPoints[2].toString() : '',
      catPoints[3] ? catPoints[3].toString() : '',
      catPoints[4] ? catPoints[4].toString() : '',
      catPoints[5] ? catPoints[5].toString() : '',
      catPoints[6] ? catPoints[6].toString() : '',
      catPoints[7] ? catPoints[7].toString() : '',
      catPoints[8] ? catPoints[8].toString() : '',
      cappedRowTotal > 0 ? cappedRowTotal.toString() : ''
    ]);
  });

  // Add Grand Total row
  tableRows.push([
    { content: 'Total points', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
    semTotals[1] ? semTotals[1].toString() : '',
    semTotals[2] ? semTotals[2].toString() : '',
    semTotals[3] ? semTotals[3].toString() : '',
    semTotals[4] ? semTotals[4].toString() : '',
    semTotals[5] ? semTotals[5].toString() : '',
    semTotals[6] ? semTotals[6].toString() : '',
    semTotals[7] ? semTotals[7].toString() : '',
    semTotals[8] ? semTotals[8].toString() : '',
    { content: grandTotalPoints.toString(), styles: { fontStyle: 'bold', fillColor: [240, 248, 255] } }
  ]);

  // Add Signature placeholders row
  tableRows.push([
    { content: 'Signature of the Mentor', colSpan: 4, styles: { fontStyle: 'bold' } },
    { content: '', colSpan: 9 }
  ]);
  tableRows.push([
    { content: 'Signature of HoD', colSpan: 4, styles: { fontStyle: 'bold' } },
    { content: '', colSpan: 9 }
  ]);

  autoTable(doc, {
    startY: 42,
    head: [
      [
        { content: 'Sno', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: 'Activity', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: 'Points', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: 'Max.\npts', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: 'Points Earned (Semesters)', colSpan: 8, styles: { halign: 'center' } },
        { content: 'Total', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } }
      ],
      ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 6.5,
      cellPadding: 1.2,
      lineColor: [0, 0, 0],
      lineWidth: 0.15,
      textColor: [20, 20, 20],
      valign: 'middle',
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 84 },
      2: { cellWidth: 10, halign: 'center' },
      3: { cellWidth: 9, halign: 'center' },
      4: { cellWidth: 8, halign: 'center' },
      5: { cellWidth: 8, halign: 'center' },
      6: { cellWidth: 8, halign: 'center' },
      7: { cellWidth: 8, halign: 'center' },
      8: { cellWidth: 8, halign: 'center' },
      9: { cellWidth: 8, halign: 'center' },
      10: { cellWidth: 8, halign: 'center' },
      11: { cellWidth: 8, halign: 'center' },
      12: { cellWidth: 9, halign: 'center', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14, bottom: 12 },
  });

  const filename = `CBIT_MAR_${student.roll_number || 'Activity_Points'}.pdf`;
  doc.save(filename);
}
