import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudentMARProgress, CBIT_24_CATEGORIES } from '../src/lib/mar-constants';

describe('CBIT MAR Points Calculation & Cap Enforcement', () => {
  it('correctly calculates approved points within single subcategory cap', () => {
    const submissions: any[] = [
      {
        id: 'sub-1',
        student_id: 'std-1',
        category_id: 1, // SNo 1 12 weeks: default 20, max 40
        semester: 5,
        claimed_points: 20,
        awarded_points: 20,
        status: 'approved',
      },
      {
        id: 'sub-2',
        student_id: 'std-1',
        category_id: 1,
        semester: 5,
        claimed_points: 20,
        awarded_points: 20,
        status: 'approved',
      },
    ];

    const result = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 60, 100);
    assert.equal(result.totalApprovedPoints, 40);
    assert.equal(result.totalUncappedApprovedPoints, 40);
    assert.equal(result.pointsRemaining, 20);
    assert.equal(result.isCompleted, false);
  });

  it('enforces subcategory cap when submissions exceed max points allowed for that subtype', () => {
    // SNo 2 Participant has max cap of 6 (default 3 pts)
    const submissions: any[] = [
      {
        id: 'sub-1',
        student_id: 'std-1',
        category_id: 4, // Participant
        category: { id: 4, sno: 2, sub_type: 'Participant', default_points: 3, max_points_allowed: 6 },
        semester: 3,
        claimed_points: 3,
        awarded_points: 3,
        status: 'approved',
      },
      {
        id: 'sub-2',
        student_id: 'std-1',
        category_id: 4,
        category: { id: 4, sno: 2, sub_type: 'Participant', default_points: 3, max_points_allowed: 6 },
        semester: 3,
        claimed_points: 3,
        awarded_points: 3,
        status: 'approved',
      },
      {
        id: 'sub-3',
        student_id: 'std-1',
        category_id: 4,
        category: { id: 4, sno: 2, sub_type: 'Participant', default_points: 3, max_points_allowed: 6 },
        semester: 4,
        claimed_points: 3,
        awarded_points: 3,
        status: 'approved',
      },
    ];

    const result = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 60, 100);
    // Uncapped earned = 9, but Participant cap = 6
    assert.equal(result.totalUncappedApprovedPoints, 9);
    assert.equal(result.categoryPointsMap[2], 6);
    assert.equal(result.totalApprovedPoints, 6);
  });

  it('correctly isolates pending and rejected points from approved totals', () => {
    const submissions: any[] = [
      {
        id: 'sub-1',
        student_id: 'std-1',
        category_id: 1,
        semester: 5,
        claimed_points: 20,
        awarded_points: 20,
        status: 'approved',
      },
      {
        id: 'sub-2',
        student_id: 'std-1',
        category_id: 2,
        semester: 5,
        claimed_points: 10,
        awarded_points: 0,
        status: 'pending_mentor',
      },
      {
        id: 'sub-3',
        student_id: 'std-1',
        category_id: 3,
        semester: 5,
        claimed_points: 15,
        awarded_points: 0,
        status: 'rejected',
      },
    ];

    const result = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 60, 100);
    assert.equal(result.totalApprovedPoints, 20);
    assert.equal(result.totalPendingPoints, 10);
    assert.equal(result.approvedCount, 1);
    assert.equal(result.pendingCount, 1);
  });

  it('applies overall program maximum cap (100 for regular, 75 for lateral entry)', () => {
    const submissions: any[] = [
      { id: '1', student_id: 's', category_id: 1, semester: 1, claimed_points: 40, awarded_points: 40, status: 'approved' },
      { id: '2', student_id: 's', category_id: 7, semester: 2, claimed_points: 40, awarded_points: 40, status: 'approved' },
      { id: '3', student_id: 's', category_id: 13, semester: 3, claimed_points: 40, awarded_points: 40, status: 'approved' },
    ];

    // Regular student: maxAllowed = 100
    const regularResult = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 60, 100);
    assert.equal(regularResult.totalApprovedPoints, 100);
    assert.equal(regularResult.isCompleted, true);
    assert.equal(regularResult.pointsRemaining, 0);

    // Lateral entry student: maxAllowed = 75, target = 45
    const lateralResult = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 45, 75);
    assert.equal(lateralResult.totalApprovedPoints, 75);
    assert.equal(lateralResult.isCompleted, true);
    assert.equal(lateralResult.pointsRemaining, 0);
  });

  it('accurately distributes approved points across semesters 1 to 8', () => {
    const submissions: any[] = [
      { id: '1', student_id: 's', category_id: 1, semester: 1, claimed_points: 20, awarded_points: 20, status: 'approved' },
      { id: '2', student_id: 's', category_id: 2, semester: 3, claimed_points: 5, awarded_points: 5, status: 'approved' },
      { id: '3', student_id: 's', category_id: 3, semester: 5, claimed_points: 10, awarded_points: 10, status: 'approved' },
    ];

    const result = calculateStudentMARProgress(submissions, CBIT_24_CATEGORIES, 60, 100);
    assert.equal(result.semesterBreakdown[1], 20);
    assert.equal(result.semesterBreakdown[2], 0);
    assert.equal(result.semesterBreakdown[3], 5);
    assert.equal(result.semesterBreakdown[4], 0);
    assert.equal(result.semesterBreakdown[5], 10);
  });
});
