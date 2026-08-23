import { ActivityCategory, StudentSubmission, UserProfile, MARCalculationResult } from '@/types';

// ============================================================================
// OFFICIAL CBIT DEPARTMENTS & COURSES LIST
// Reference: https://www.cbit.ac.in/admission_post/ug-pg-course-list/
// ============================================================================
export const CBIT_DEPARTMENTS = [
  {
    code: 'AIDS',
    name: 'Artificial Intelligence and Data Science (AI&DS)',
    degrees: ['B.Tech'],
    hod: 'Dr. K. Radhika',
    hodEmail: 'kradhika.aids@cbit.ac.in',
    intake: 180,
    sections: ['1', '2', '3']
  },
  {
    code: 'CSE',
    name: 'Computer Science and Engineering (CSE)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Prof. Y. Rama Devi',
    hodEmail: 'hod_cse@cbit.ac.in',
    intake: 180,
    sections: ['1', '2', '3']
  },
  {
    code: 'AIML',
    name: 'Artificial Intelligence and Machine Learning (AI&ML)',
    degrees: ['B.Tech'],
    hod: 'Dr. M. Swamy Das',
    hodEmail: 'hod_aiml@cbit.ac.in',
    intake: 60,
    sections: ['1']
  },
  {
    code: 'CSE-AIML',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    degrees: ['B.E.'],
    hod: 'Prof. Y. Rama Devi',
    hodEmail: 'hod_cse@cbit.ac.in',
    intake: 60,
    sections: ['1']
  },
  {
    code: 'CSE-IOT',
    name: 'CSE (IoT & Cyber Security including Blockchain)',
    degrees: ['B.E.'],
    hod: 'Prof. Y. Rama Devi',
    hodEmail: 'hod_cse@cbit.ac.in',
    intake: 60,
    sections: ['1']
  },
  {
    code: 'IT',
    name: 'Information Technology (IT)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Dr. Suresh Pabboju',
    hodEmail: 'hod_it@cbit.ac.in',
    intake: 180,
    sections: ['1', '2', '3']
  },
  {
    code: 'ECE',
    name: 'Electronics and Communication Engineering (ECE)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Dr. A. Suparshya Babu',
    hodEmail: 'hod_ece@cbit.ac.in',
    intake: 180,
    sections: ['1', '2', '3']
  },
  {
    code: 'EEE',
    name: 'Electrical and Electronics Engineering (EEE)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Dr. G. Suresh Babu',
    hodEmail: 'hod_eee@cbit.ac.in',
    intake: 120,
    sections: ['1', '2']
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering (ME)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Dr. P. Ravinder Reddy',
    hodEmail: 'hod_mech@cbit.ac.in',
    intake: 120,
    sections: ['1', '2']
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering (CE)',
    degrees: ['B.E.', 'M.Tech'],
    hod: 'Dr. K. Jagannadha Rao',
    hodEmail: 'hod_civil@cbit.ac.in',
    intake: 120,
    sections: ['1', '2']
  },
  {
    code: 'CHEM',
    name: 'Chemical Engineering (ChE)',
    degrees: ['B.Tech'],
    hod: 'Dr. P. V. Naga Prapurna',
    hodEmail: 'hod_chem@cbit.ac.in',
    intake: 60,
    sections: ['1']
  },
  {
    code: 'BIOTECH',
    name: 'Biotechnology (BioTech)',
    degrees: ['B.Tech'],
    hod: 'Dr. C. Obula Reddy',
    hodEmail: 'hod_biotech@cbit.ac.in',
    intake: 60,
    sections: ['1']
  },
  {
    code: 'MBA',
    name: 'School of Management Studies (MBA)',
    degrees: ['MBA'],
    hod: 'Dr. S. Saraswathi',
    hodEmail: 'hod_mba@cbit.ac.in',
    intake: 120,
    sections: ['1', '2']
  },
  {
    code: 'MCA',
    name: 'Master of Computer Applications (MCA)',
    degrees: ['MCA'],
    hod: 'Dr. D. L. S. Reddy',
    hodEmail: 'hod_mca@cbit.ac.in',
    intake: 60,
    sections: ['1']
  }
];

// ============================================================================
// THE 24 MANDATORY ADDITIONAL REQUIREMENTS (MAR) ACTIVITY CATEGORIES (CBIT AUTONOMOUS)
// ============================================================================
export const CBIT_24_CATEGORIES: ActivityCategory[] = [
  {
    id: 1,
    sno: 1,
    name: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
    sub_type: "12 weeks",
    default_points: 20,
    max_points_allowed: 40,
    description: "Online certification courses of 12-week duration from SWAYAM, NPTEL, Coursera, edX, etc."
  },
  {
    id: 2,
    sno: 1,
    name: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
    sub_type: "8 weeks",
    default_points: 16,
    max_points_allowed: 40,
    description: "Online certification courses of 8-week duration from SWAYAM, NPTEL, Coursera, etc."
  },
  {
    id: 3,
    sno: 2,
    name: "Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.",
    sub_type: "Organizer",
    default_points: 5,
    max_points_allowed: 10,
    description: "Lead/Organizer in college technical fests (e.g. SUDHEE), hackathons, national conferences, or workshops."
  },
  {
    id: 4,
    sno: 2,
    name: "Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.",
    sub_type: "Participant",
    default_points: 3,
    max_points_allowed: 6,
    description: "Active participant in technical fests, hackathons, coding challenges, or technical workshops."
  },
  {
    id: 5,
    sno: 3,
    name: "Rural Reporting",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Rural community reporting, village social development surveys, and field research initiatives."
  },
  {
    id: 6,
    sno: 4,
    name: "Harithaharam /plantation",
    sub_type: "General",
    default_points: 1,
    max_points_allowed: 5,
    description: "Participation in Telangana Harithaharam tree plantation drives and campus green initiatives."
  },
  {
    id: 7,
    sno: 5,
    name: "Participation in Relief camps",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 40,
    description: "Active volunteering and service in disaster relief camps or emergency community rehabilitation."
  },
  {
    id: 8,
    sno: 6,
    name: "Participation in Debate/ Group Discussion/ Technical Quiz",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Participation in inter-college/intra-college debates, GDs, technical quizzes, and elocution competitions."
  },
  {
    id: 9,
    sno: 7,
    name: "Publication in News Paper, Magazines in institution level (Magazine / article/internet)",
    sub_type: "Editor",
    default_points: 10,
    max_points_allowed: 20,
    description: "Editor or Chief Editor of college/department newsletters, technical magazines (e.g. Transcending, CBIT Gazette)."
  },
  {
    id: 10,
    sno: 7,
    name: "Publication in News Paper, Magazines in institution level (Magazine / article/internet)",
    sub_type: "Writer",
    default_points: 5,
    max_points_allowed: 10,
    description: "Author/Contributor of technical or literary articles in institutional magazines or college portals."
  },
  {
    id: 11,
    sno: 8,
    name: "Publication in News Paper, Magazine & Blogs",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Articles published in external mainstream newspapers, recognized technology magazines, or verified blogs."
  },
  {
    id: 12,
    sno: 9,
    name: "Research Publication (per publication)",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Authoring and publishing peer-reviewed research papers in Scopus/UGC CARE/IEEE indexed journals or conferences."
  },
  {
    id: 13,
    sno: 10,
    name: "Innovation Projects (other than course requirements)",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 40,
    description: "Developing innovative hardware/software prototypes, patent filings, or startup MVP projects outside academic curriculum."
  },
  {
    id: 14,
    sno: 11,
    name: "Blood donation /NSS or NCC participation",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Voluntary blood donation certified by Red Cross/Lions Club or active participation in regular NSS/NCC activities."
  },
  {
    id: 15,
    sno: 12,
    name: "Blood donation/NSS camp organization",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Organizing and coordinating voluntary blood donation camps or residential NSS social service camps."
  },
  {
    id: 16,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "College level",
    default_points: 5,
    max_points_allowed: 10,
    description: "Participation in inter-departmental college sports tournaments and annual athletic meets."
  },
  {
    id: 17,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "University level",
    default_points: 10,
    max_points_allowed: 20,
    description: "Representing CBIT in Osmania University inter-college sports tournaments or inter-university meets."
  },
  {
    id: 18,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "Region level",
    default_points: 12,
    max_points_allowed: 24,
    description: "Participation in regional/zonal sports competitions representing college or district."
  },
  {
    id: 19,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "State level",
    default_points: 15,
    max_points_allowed: 30,
    description: "Participation in Telangana state-level sports championships and games."
  },
  {
    id: 20,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "National level",
    default_points: 20,
    max_points_allowed: 20,
    description: "Representing Telangana state or university at national-level sports events and Khelo India games."
  },
  {
    id: 21,
    sno: 14,
    name: "Cultural Programme (Dance, Drama, Elocution, Music etc. )",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Participation or performance in dance, classical/western music, theatre drama, or annual fest (e.g. SHRUTHI)."
  },
  {
    id: 22,
    sno: 15,
    name: "Member of Professional Society",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Active annual student membership in professional bodies like IEEE, CSI, ACM, IETE, ASME, SAE, etc."
  },
  {
    id: 23,
    sno: 16,
    name: "Student Chapter /Cubs",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Active membership and contributions to recognized campus clubs (e.g. Robotics Club, Coding Club, Toastmasters)."
  },
  {
    id: 24,
    sno: 17,
    name: "Relevant Industry Visit & Report",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Attending department-approved industrial visits and submitting verified technical observation report."
  },
  {
    id: 25,
    sno: 18,
    name: "Photography activities in different Clubs (Photography club, Cine club)",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Creative photography, short-filmmaking, and digital media coverage for college events."
  },
  {
    id: 26,
    sno: 19,
    name: "Participation in Yoga camp",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Participation in certified yoga camps, mindfulness training, and International Yoga Day celebrations."
  },
  {
    id: 27,
    sno: 20,
    name: "Self-Entrepreneurship Program",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 20,
    description: "Incubating a startup, founding an enterprise, or graduating from recognized entrepreneurship accelerators."
  },
  {
    id: 28,
    sno: 21,
    name: "Adventure sports with Certification",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Certified participation in mountaineering, trekking expeditions, parasailing, or adventure sports camps."
  },
  {
    id: 29,
    sno: 22,
    name: "Training to under privileged Physically challenged",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Voluntary community tutoring, technical skill training, or assistance for differently-abled/underprivileged children."
  },
  {
    id: 30,
    sno: 23,
    name: "Community Service & Allied Activities",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Sustained community service, environmental campaigns, or village empowerment initiatives."
  },
  {
    id: 31,
    sno: 24,
    name: "Class Representative",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Elected or nominated Class Representative (CR) discharging responsibilities for an entire academic year."
  }
];

export const CBIT_COLLEGE_NAME = "CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)";
export const CBIT_COLLEGE_CODE = "HYDERABAD - 500075";
export const MAR_DOCUMENT_TITLE = "RECORD OF ACTIVITIES FOR ACTIVITY POINTS";

export const DEFAULT_REGULAR_TARGET_POINTS = 60;
export const DEFAULT_LATERAL_ENTRY_TARGET_POINTS = 50;

// Target Activity Points for Graduation (CBIT Autonomous)
export const DEFAULT_SETTINGS = {
  regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
  lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
  college_name: CBIT_COLLEGE_NAME,
  college_code: CBIT_COLLEGE_CODE,
  academic_year: "2025-2026"
};

// Calculate Student Progress with Category Caps applied
export function calculateStudentMARProgress(
  submissions: StudentSubmission[],
  categories: ActivityCategory[] = CBIT_24_CATEGORIES,
  targetPoints: number = 60
): MARCalculationResult {
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const pendingSubmissions = submissions.filter(s => s.status === 'pending_mentor');

  // Group approved submissions by Category SNo (1 to 24)
  const categoryPointsMap: Record<number, number> = {};
  const semesterMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

  let totalUncappedApprovedPoints = 0;
  let totalPendingPoints = 0;

  pendingSubmissions.forEach(sub => {
    totalPendingPoints += (sub.claimed_points || 0);
  });

  approvedSubmissions.forEach(sub => {
    const pts = sub.awarded_points ?? sub.claimed_points ?? 0;
    totalUncappedApprovedPoints += pts;

    // Attribute to category
    const cat = categories.find(c => c.id === sub.category_id);
    const sno = cat ? cat.sno : 1;
    categoryPointsMap[sno] = (categoryPointsMap[sno] || 0) + pts;

    // Attribute to semester
    const sem = sub.semester || 1;
    semesterMap[sem] = (semesterMap[sem] || 0) + pts;
  });

  // Apply maximum allowable cap per category SNo
  let totalCappedApprovedPoints = 0;
  Object.entries(categoryPointsMap).forEach(([snoStr, earned]) => {
    const sno = Number(snoStr);
    const matchingCats = categories.filter(c => c.sno === sno);
    const maxCap = matchingCats.length > 0 ? matchingCats[0].max_points_allowed : 40;
    totalCappedApprovedPoints += Math.min(earned, maxCap);
  });

  const percentage = Math.min(100, Math.round((totalCappedApprovedPoints / targetPoints) * 100));
  const isCompleted = totalCappedApprovedPoints >= targetPoints;
  const pointsRemaining = Math.max(0, targetPoints - totalCappedApprovedPoints);

  return {
    totalApprovedPoints: totalCappedApprovedPoints,
    totalUncappedApprovedPoints,
    totalPendingPoints,
    targetPoints,
    percentage,
    isCompleted,
    pointsRemaining,
    semesterBreakdown: semesterMap,
    categoryPointsMap,
    approvedCount: approvedSubmissions.length,
    pendingCount: pendingSubmissions.length,
  };
}

// Student User: Shaik Saleem (AI&DS, Section 2, 5th Sem, Batch of 2026)
export const MOCK_CURRENT_USER: UserProfile = {
  id: "usr-student-001",
  email: "saleemshaik2005@cbit.ac.in",
  full_name: "Shaik Saleem",
  role: "student",
  roll_number: "160122771045",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  section: "2",
  batch_year: "2022-2026 (5th Semester)",
  is_lateral_entry: false,
  mentor_id: "usr-mentor-001",
  mentor_name: "Dr. D. Ramana (Assoc. Prof & Head, AI&DS)",
  phone_number: "+91 98765 43210"
};

// Faculty Mentor: Dr. D. Ramana (Head, Department of AI&DS)
export const MOCK_MENTOR_USER: UserProfile = {
  id: "usr-mentor-001",
  email: "dramana.aids@cbit.ac.in",
  full_name: "Dr. D. Ramana",
  role: "mentor",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  batch_year: "Faculty / Project Guide",
  is_lateral_entry: false,
};

// Mock initial approved and pending submissions for Shaik Saleem
export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub-001",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160122771045",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Deep Learning & AI Foundations 12-Week Certification",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: "2024-04-28",
    semester: 4,
    academic_year: "2023-2024",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Verified with NPTEL score sheet. Excellent performance with Elite+Silver medal.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. D. Ramana",
    approved_at: "2024-05-02T10:30:00Z",
    created_at: "2024-05-01T08:15:00Z"
  },
  {
    id: "sub-002",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160122771045",
    category_id: 3, // Tech Fest Organizer
    category: CBIT_24_CATEGORIES[2],
    activity_title: "SUDHEE 2024 National Technical Fest - Core AI Team Lead",
    issuing_organization: "CBIT Hyderabad",
    event_date: "2024-03-15",
    semester: 4,
    academic_year: "2023-2024",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Confirmed by Sudhee 2024 Faculty Convener.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. D. Ramana",
    approved_at: "2024-03-20T14:20:00Z",
    created_at: "2024-03-18T11:00:00Z"
  },
  {
    id: "sub-003",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160122771045",
    category_id: 14, // Blood donation / NSS
    category: CBIT_24_CATEGORIES[13],
    activity_title: "Voluntary Blood Donation Camp - Youth Red Cross Unit",
    issuing_organization: "Indian Red Cross Society & NSS CBIT",
    event_date: "2023-11-10",
    semester: 3,
    academic_year: "2023-2024",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Blood donor certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. D. Ramana",
    approved_at: "2023-11-15T09:00:00Z",
    created_at: "2023-11-12T16:00:00Z"
  },
  {
    id: "sub-004",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160122771045",
    category_id: 22, // IEEE Student Chapter Member
    category: CBIT_24_CATEGORIES[21],
    activity_title: "IEEE Computer Society Student Branch Membership (2024-25)",
    issuing_organization: "IEEE Hyderabad Section",
    event_date: "2024-01-20",
    semester: 3,
    academic_year: "2023-2024",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Active IEEE membership verified with membership number.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. D. Ramana",
    approved_at: "2024-01-25T11:00:00Z",
    created_at: "2024-01-22T10:00:00Z"
  }
];
