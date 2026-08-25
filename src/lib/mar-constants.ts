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
    hod: 'Head of Department (AI&DS)',
    hodEmail: 'hod.aids@cbit.ac.in',
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
export const DEFAULT_REGULAR_MAX_POINTS = 100;
export const DEFAULT_LATERAL_ENTRY_TARGET_POINTS = 45;
export const DEFAULT_LATERAL_ENTRY_MAX_POINTS = 75;

// Target Activity Points for Graduation (CBIT Autonomous)
export const DEFAULT_SETTINGS = {
  regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
  regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
  lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
  lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
  college_name: CBIT_COLLEGE_NAME,
  college_code: CBIT_COLLEGE_CODE,
  academic_year: "2025-2026"
};

// Calculate Student Progress with Category Caps and Maximum Program Caps applied
export function calculateStudentMARProgress(
  submissions: StudentSubmission[],
  categories: ActivityCategory[] = CBIT_24_CATEGORIES,
  targetPoints: number = 60,
  maxPointsAllowed: number = 100
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
    const pts = Number(sub.awarded_points !== undefined && sub.awarded_points !== null ? sub.awarded_points : (sub.claimed_points || 0));
    totalUncappedApprovedPoints += pts;

    // Attribute to category
    const cat = categories.find(c => c.id === sub.category_id || c.sno === sub.category_id) || sub.category;
    const sno = cat ? cat.sno : (typeof sub.category_id === 'number' ? sub.category_id : 1);
    categoryPointsMap[sno] = (categoryPointsMap[sno] || 0) + pts;

    // Attribute to semester
    const sem = Number(sub.semester) || 1;
    semesterMap[sem] = (semesterMap[sem] || 0) + pts;
  });

  // Apply maximum allowable cap per category SNo
  let totalCappedApprovedPoints = 0;
  Object.entries(categoryPointsMap).forEach(([snoStr, earned]) => {
    const sno = Number(snoStr);
    const matchingCats = categories.filter(c => c.sno === sno || c.id === sno);
    const maxCap = matchingCats.length > 0 ? matchingCats[0].max_points_allowed : 40;
    totalCappedApprovedPoints += Math.min(earned, maxCap);
  });

  // Apply program-level max cap (100 pts for Regular, 75 pts for Lateral Entry)
  const finalApprovedPoints = Math.min(totalCappedApprovedPoints, maxPointsAllowed);

  const percentage = Math.min(100, Math.round((finalApprovedPoints / targetPoints) * 100));
  const isCompleted = finalApprovedPoints >= targetPoints;
  const pointsRemaining = Math.max(0, targetPoints - finalApprovedPoints);

  return {
    totalApprovedPoints: finalApprovedPoints,
    totalUncappedApprovedPoints,
    totalPendingPoints,
    targetPoints,
    maxPointsAllowed,
    percentage,
    isCompleted,
    pointsRemaining,
    semesterBreakdown: semesterMap,
    categoryPointsMap,
    approvedCount: approvedSubmissions.length,
    pendingCount: pendingSubmissions.length,
  };
}

// Student User: Shaik Saleem (AI&DS, Section 2, 5th Sem, Batch of 2024-2028)
export const MOCK_CURRENT_USER: UserProfile = {
  id: "usr-student-001",
  email: "saleemshaik2005@cbit.ac.in",
  full_name: "Shaik Saleem",
  role: "student",
  roll_number: "160122771045",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  section: "2",
  batch_year: "2024-2028 (5th Semester)",
  is_lateral_entry: false,
  mentor_id: "usr-mentor-001",
  mentor_name: "Faculty Mentor (AI&DS)",
  phone_number: "+91 98765 43210",
  resume_url: "https://drive.google.com/file/d/sample-resume-saleem/view",
  skills: ["Python", "TensorFlow", "React", "Next.js", "AI Document Intelligence", "Data Structures"],
  github_url: "https://github.com/saleemshaik2005",
  linkedin_url: "https://linkedin.com/in/saleemshaik"
};

// Faculty Mentor
export const MOCK_MENTOR_USER: UserProfile = {
  id: "usr-mentor-001",
  email: "mentor.aids@cbit.ac.in",
  full_name: "Faculty Mentor",
  role: "mentor",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  batch_year: "Faculty Counselor",
  is_lateral_entry: false,
};

// Mock initial approved and pending submissions across mentees
export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  // Shaik Saleem (usr-student-001)
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
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Verified with NPTEL score sheet. Excellent performance with Elite+Silver medal.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
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
    academic_year: "2024-2025",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Confirmed by Sudhee 2024 Faculty Convener.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
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
    academic_year: "2024-2025",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Blood donor certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
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
    academic_year: "2024-2025",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Active IEEE membership verified with membership number.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-01-25T11:00:00Z",
    created_at: "2024-01-22T10:00:00Z"
  },
  {
    id: "sub-005",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160122771045",
    category_id: 13, // Innovation Projects
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Generative AI & LLM Systems Industry Internship (8-Weeks)",
    issuing_organization: "Tech Mahindra AI R&D Center",
    event_date: "2024-07-20",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Verified completion certificate and internship project evaluation report.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-08-01T15:00:00Z",
    created_at: "2024-07-25T09:00:00Z"
  },

  // Sneha Reddy (usr-student-002)
  {
    id: "sub-006",
    student_id: "usr-student-002",
    student_name: "Sneha Reddy",
    student_roll_no: "160122771046",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Cloud Computing & Distributed Architecture 12-Week Course",
    issuing_organization: "NPTEL / IIT Kharagpur (SWAYAM)",
    event_date: "2024-04-20",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Verified certificate with 84% consolidated score.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-05-05T12:00:00Z",
    created_at: "2024-05-02T10:00:00Z"
  },
  {
    id: "sub-007",
    student_id: "usr-student-002",
    student_name: "Sneha Reddy",
    student_roll_no: "160122771046",
    category_id: 13, // Innovation Projects / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Cloud Infrastructure & DevOps Summer Internship (6-Weeks)",
    issuing_organization: "Wipro Technologies Hyderabad",
    event_date: "2024-07-15",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Internship letter and mentor evaluation report verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-07-25T11:00:00Z",
    created_at: "2024-07-20T10:00:00Z"
  },
  {
    id: "sub-008",
    student_id: "usr-student-002",
    student_name: "Sneha Reddy",
    student_roll_no: "160122771046",
    category_id: 4, // Tech Fest Participant
    category: CBIT_24_CATEGORIES[3],
    activity_title: "Smart India Hackathon (SIH 2024) Campus Edition Participant",
    issuing_organization: "CBIT Hackathon Club",
    event_date: "2024-02-18",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 3,
    awarded_points: 3,
    certificate_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "SIH participation verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-02-25T14:00:00Z",
    created_at: "2024-02-20T11:00:00Z"
  },

  // Mohammed Farhan (usr-student-003, Lateral Entry)
  {
    id: "sub-009",
    student_id: "usr-student-003",
    student_name: "Mohammed Farhan",
    student_roll_no: "160122771301",
    category_id: 2, // MOOCs 8 weeks
    category: CBIT_24_CATEGORIES[1],
    activity_title: "NPTEL Introduction to Internet of Things (IoT) 8-Week Course",
    issuing_organization: "NPTEL / IIT Kharagpur (SWAYAM)",
    event_date: "2024-03-25",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 16,
    awarded_points: 16,
    certificate_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "NPTEL Certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-04-02T10:00:00Z",
    created_at: "2024-03-30T10:00:00Z"
  },
  {
    id: "sub-010",
    student_id: "usr-student-003",
    student_name: "Mohammed Farhan",
    student_roll_no: "160122771301",
    category_id: 13, // Innovation / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Full-Stack Web Development & Cloud Internship (8-Weeks)",
    issuing_organization: "Infosys Springboard / Campus Connect",
    event_date: "2024-06-30",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Infosys Springboard internship verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-07-10T14:00:00Z",
    created_at: "2024-07-05T11:00:00Z"
  },
  {
    id: "sub-011",
    student_id: "usr-student-003",
    student_name: "Mohammed Farhan",
    student_roll_no: "160122771301",
    category_id: 16, // Sports
    category: CBIT_24_CATEGORIES[15],
    activity_title: "Inter-College Cricket Tournament Runners-Up",
    issuing_organization: "CBIT Physical Education Department",
    event_date: "2024-02-10",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Sports participation confirmed.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-02-15T10:00:00Z",
    created_at: "2024-02-12T10:00:00Z"
  },

  // Ananya Rao (usr-student-004)
  {
    id: "sub-012",
    student_id: "usr-student-004",
    student_name: "Ananya Rao",
    student_roll_no: "160122771089",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Natural Language Processing & Large Language Models",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: "2024-04-25",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Elite+Gold certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-05-02T10:00:00Z",
    created_at: "2024-04-28T09:00:00Z"
  },
  {
    id: "sub-013",
    student_id: "usr-student-004",
    student_name: "Ananya Rao",
    student_roll_no: "160122771089",
    category_id: 13, // Innovation / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Data Science & Machine Learning Research Internship (8-Weeks)",
    issuing_organization: "TCS Research & Innovation Labs",
    event_date: "2024-07-28",
    semester: 4,
    academic_year: "2024-2025",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "TCS Research internship verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Faculty Mentor",
    approved_at: "2024-08-05T14:00:00Z",
    created_at: "2024-08-01T10:00:00Z"
  }
];

export interface FacultyMentorDetail {
  id: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  email: string;
  phone: string;
  cabin: string;
  menteeCount: number;
  pendingReviews: number;
  approvedReviews: number;
  averagePoints: number;
  complianceRate: number;
  mentees: {
    id: string;
    name: string;
    roll: string;
    section: string;
    points: number;
    target: number;
    isLateral: boolean;
    status: 'Satisfied' | 'In Progress' | 'At Risk';
    nptelDone: boolean;
    internshipDone: boolean;
    resumeUrl?: string;
  }[];
}

export const DEPARTMENT_FACULTY_MENTORS: FacultyMentorDetail[] = [
  {
    id: "fm-01",
    name: "Dr. K. Ramana",
    designation: "Associate Professor & Senior Mentor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "kramana_aids@cbit.ac.in",
    phone: "+91 98480 12345",
    cabin: "AI&DS Block, Room 304",
    menteeCount: 24,
    pendingReviews: 3,
    approvedReviews: 48,
    averagePoints: 52.4,
    complianceRate: 87.5,
    mentees: [
      { id: "usr-student-001", name: "Shaik Saleem", roll: "160122771045", section: "2", points: 55, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-saleem/view" },
      { id: "usr-student-002", name: "Sneha Reddy", roll: "160122771046", section: "2", points: 63, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-sneha/view" },
      { id: "usr-student-005", name: "K. Sai Tarun", roll: "160122771047", section: "2", points: 60, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false },
      { id: "usr-student-006", name: "V. Harini", roll: "160122771048", section: "2", points: 42, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
      { id: "usr-student-007", name: "Ch. Karthik", roll: "160122771049", section: "2", points: 25, target: 60, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false },
      { id: "usr-student-008", name: "M. Deepika", roll: "160122771050", section: "2", points: 65, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
    ]
  },
  {
    id: "fm-02",
    name: "Prof. M. Srinivasa Rao",
    designation: "Professor & Section 1 Coordinator",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "1",
    email: "msrao_aids@cbit.ac.in",
    phone: "+91 98480 12346",
    cabin: "AI&DS Block, Room 301",
    menteeCount: 22,
    pendingReviews: 2,
    approvedReviews: 44,
    averagePoints: 54.2,
    complianceRate: 88.0,
    mentees: [
      { id: "usr-student-003", name: "Mohammed Farhan", roll: "160122771301", section: "1", points: 46, target: 45, isLateral: true, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-farhan/view" },
      { id: "usr-student-009", name: "P. Rithvik", roll: "160122771001", section: "1", points: 62, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
      { id: "usr-student-010", name: "S. Niharika", roll: "160122771002", section: "1", points: 58, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
      { id: "usr-student-011", name: "A. Praveen", roll: "160122771003", section: "1", points: 28, target: 60, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false },
      { id: "usr-student-012", name: "B. Bhavana", roll: "160122771004", section: "1", points: 64, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
    ]
  },
  {
    id: "fm-03",
    name: "Dr. T. Sridevi",
    designation: "Associate Professor & Section 2 Coordinator",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "tsridevi_aids@cbit.ac.in",
    phone: "+91 98480 12347",
    cabin: "AI&DS Block, Room 305",
    menteeCount: 22,
    pendingReviews: 1,
    approvedReviews: 46,
    averagePoints: 51.0,
    complianceRate: 85.0,
    mentees: [
      { id: "usr-student-013", name: "G. Varun", roll: "160122771051", section: "2", points: 61, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false },
      { id: "usr-student-014", name: "N. Pooja", roll: "160122771052", section: "2", points: 48, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
      { id: "usr-student-015", name: "R. Yashwanth", roll: "160122771053", section: "2", points: 30, target: 60, isLateral: false, status: "In Progress", nptelDone: false, internshipDone: false },
    ]
  },
  {
    id: "fm-04",
    name: "Dr. B. Indira",
    designation: "Associate Professor & Section 3 Coordinator",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "3",
    email: "bindira_aids@cbit.ac.in",
    phone: "+91 98480 12348",
    cabin: "AI&DS Block, Room 308",
    menteeCount: 21,
    pendingReviews: 4,
    approvedReviews: 40,
    averagePoints: 49.5,
    complianceRate: 80.0,
    mentees: [
      { id: "usr-student-004", name: "Ananya Rao", roll: "160122771089", section: "3", points: 60, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-ananya/view" },
      { id: "usr-student-016", name: "K. Rohit", roll: "160122771090", section: "3", points: 52, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
      { id: "usr-student-017", name: "D. Meghana", roll: "160122771091", section: "3", points: 22, target: 60, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false },
    ]
  },
  {
    id: "fm-05",
    name: "Sri. G. Mallikarjuna Rao",
    designation: "Assistant Professor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "1",
    email: "gmrao_aids@cbit.ac.in",
    phone: "+91 98480 12349",
    cabin: "AI&DS Block, Room 302",
    menteeCount: 22,
    pendingReviews: 0,
    approvedReviews: 42,
    averagePoints: 53.0,
    complianceRate: 86.4,
    mentees: [
      { id: "usr-student-018", name: "T. Akhil", roll: "160122771005", section: "1", points: 60, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
      { id: "usr-student-019", name: "M. Tejaswi", roll: "160122771006", section: "1", points: 45, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
    ]
  },
  {
    id: "fm-06",
    name: "Smt. P. Vimala",
    designation: "Assistant Professor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "pvimala_aids@cbit.ac.in",
    phone: "+91 98480 12350",
    cabin: "AI&DS Block, Room 306",
    menteeCount: 22,
    pendingReviews: 2,
    approvedReviews: 39,
    averagePoints: 50.8,
    complianceRate: 81.8,
    mentees: [
      { id: "usr-student-020", name: "S. Ajay", roll: "160122771054", section: "2", points: 64, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false },
      { id: "usr-student-021", name: "E. Shravya", roll: "160122771055", section: "2", points: 38, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
    ]
  },
  {
    id: "fm-07",
    name: "Dr. Ch. Rakesh",
    designation: "Assistant Professor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "3",
    email: "chrakesh_aids@cbit.ac.in",
    phone: "+91 98480 12351",
    cabin: "AI&DS Block, Room 309",
    menteeCount: 21,
    pendingReviews: 1,
    approvedReviews: 38,
    averagePoints: 48.2,
    complianceRate: 76.2,
    mentees: [
      { id: "usr-student-022", name: "P. Vinay", roll: "160122771092", section: "3", points: 60, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
      { id: "usr-student-023", name: "J. Swetha", roll: "160122771093", section: "3", points: 26, target: 60, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false },
    ]
  },
  {
    id: "fm-08",
    name: "Smt. K. Soumya",
    designation: "Assistant Professor",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "1",
    email: "ksoumya_aids@cbit.ac.in",
    phone: "+91 98480 12352",
    cabin: "AI&DS Block, Room 303",
    menteeCount: 22,
    pendingReviews: 1,
    approvedReviews: 41,
    averagePoints: 52.0,
    complianceRate: 86.0,
    mentees: [
      { id: "usr-student-024", name: "V. Harish", roll: "160122771007", section: "1", points: 65, target: 60, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true },
      { id: "usr-student-025", name: "L. Keerthana", roll: "160122771008", section: "1", points: 44, target: 60, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false },
    ]
  }
];

export const DEPARTMENT_ALL_STUDENTS = [
  { id: "usr-student-001", name: "Shaik Saleem", roll: "160122771045", section: "2", mentor: "Dr. K. Ramana", points: 55, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-saleem/view", skills: ["Python", "TensorFlow", "React", "AI OCR", "SQL"] },
  { id: "usr-student-002", name: "Sneha Reddy", roll: "160122771046", section: "2", mentor: "Dr. K. Ramana", points: 63, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-sneha/view", skills: ["Cloud Computing", "AWS", "DevOps", "Docker"] },
  { id: "usr-student-003", name: "Mohammed Farhan", roll: "160122771301", section: "1", mentor: "Prof. M. Srinivasa Rao", points: 46, target: 45, maxCap: 75, isLateral: true, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-farhan/view", skills: ["IoT Systems", "Full-Stack Web", "Node.js", "C++"] },
  { id: "usr-student-004", name: "Ananya Rao", roll: "160122771089", section: "3", mentor: "Dr. B. Indira", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-ananya/view", skills: ["NLP", "Deep Learning", "PyTorch", "Data Science"] },
  { id: "usr-student-005", name: "K. Sai Tarun", roll: "160122771047", section: "2", mentor: "Dr. K. Ramana", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false, skills: ["Java", "Spring Boot", "React"] },
  { id: "usr-student-006", name: "V. Harini", roll: "160122771048", section: "2", mentor: "Dr. K. Ramana", points: 42, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Machine Learning", "Pandas"] },
  { id: "usr-student-007", name: "Ch. Karthik", roll: "160122771049", section: "2", mentor: "Dr. K. Ramana", points: 25, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["C", "Data Structures"] },
  { id: "usr-student-008", name: "M. Deepika", roll: "160122771050", section: "2", mentor: "Dr. K. Ramana", points: 65, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Computer Vision", "OpenCV", "Python"] },
  { id: "usr-student-009", name: "P. Rithvik", roll: "160122771001", section: "1", mentor: "Prof. M. Srinivasa Rao", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cybersecurity", "Network Security", "Linux"] },
  { id: "usr-student-010", name: "S. Niharika", roll: "160122771002", section: "1", mentor: "Prof. M. Srinivasa Rao", points: 58, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["UI/UX Design", "Figma", "Frontend"] },
  { id: "usr-student-011", name: "A. Praveen", roll: "160122771003", section: "1", mentor: "Prof. M. Srinivasa Rao", points: 28, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Web Basics", "HTML", "CSS"] },
  { id: "usr-student-012", name: "B. Bhavana", roll: "160122771004", section: "1", mentor: "Prof. M. Srinivasa Rao", points: 64, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud Architect", "GCP", "Kubernetes"] },
  { id: "usr-student-013", name: "G. Varun", roll: "160122771051", section: "2", mentor: "Dr. T. Sridevi", points: 61, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false, skills: ["Node.js", "Express", "MongoDB"] },
  { id: "usr-student-014", name: "N. Pooja", roll: "160122771052", section: "2", mentor: "Dr. T. Sridevi", points: 48, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Data Analysis", "SQL", "Tableau"] },
  { id: "usr-student-015", name: "R. Yashwanth", roll: "160122771053", section: "2", mentor: "Dr. T. Sridevi", points: 30, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: false, internshipDone: false, skills: ["Python", "Django"] },
  { id: "usr-student-016", name: "K. Rohit", roll: "160122771090", section: "3", mentor: "Dr. B. Indira", points: 52, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Deep Learning", "TensorFlow", "Keras"] },
  { id: "usr-student-017", name: "D. Meghana", roll: "160122771091", section: "3", mentor: "Dr. B. Indira", points: 22, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Python", "Flask"] },
  { id: "usr-student-018", name: "T. Akhil", roll: "160122771005", section: "1", mentor: "Sri. G. Mallikarjuna Rao", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["React Native", "Mobile App Dev"] },
  { id: "usr-student-019", name: "M. Tejaswi", roll: "160122771006", section: "1", mentor: "Sri. G. Mallikarjuna Rao", points: 45, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Angular", "TypeScript"] },
  { id: "usr-student-020", name: "S. Ajay", roll: "160122771054", section: "2", mentor: "Smt. P. Vimala", points: 64, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: false, skills: ["Embedded Systems", "Robotics"] },
  { id: "usr-student-021", name: "E. Shravya", roll: "160122771055", section: "2", mentor: "Smt. P. Vimala", points: 38, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Data Visualization", "PowerBI"] },
  { id: "usr-student-022", name: "P. Vinay", roll: "160122771092", section: "3", mentor: "Dr. Ch. Rakesh", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Blockchain", "Solidity", "Smart Contracts"] },
  { id: "usr-student-023", name: "J. Swetha", roll: "160122771093", section: "3", mentor: "Dr. Ch. Rakesh", points: 26, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Java", "OOP"] },
  { id: "usr-student-024", name: "V. Harish", roll: "160122771007", section: "1", mentor: "Smt. K. Soumya", points: 65, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["AWS", "DevOps", "Terraform"] },
  { id: "usr-student-025", name: "L. Keerthana", roll: "160122771008", section: "1", mentor: "Smt. K. Soumya", points: 44, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Scikit-Learn"] },
];
