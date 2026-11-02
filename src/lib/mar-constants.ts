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
  id: "9c448454-2a1a-4a57-9dea-bf1ba36f4d97",
  email: "saleemshaik2005@gmail.com",
  full_name: "Shaik Saleem",
  role: "student",
  roll_number: "160124771129",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  section: "2",
  batch_year: "2024-2028 (5th Semester)",
  is_lateral_entry: false,
  mentor_id: "dd38a4de-c509-44dd-99c6-5d98f6bb29c4",
  mentor_name: "Dr. Anireddy Srilakshmi",
  mentor_email: "srilakshmia_aids@cbit.ac.in",
  mentor_history: [
    { semester: 5, academic_year: "2026-2027", mentor_id: "dd38a4de-c509-44dd-99c6-5d98f6bb29c4", mentor_name: "Dr. Anireddy Srilakshmi", designation: "Assistant Professor & Faculty Mentor", email: "srilakshmia_aids@cbit.ac.in", cabin: "AI&DS Block", is_current: true },
  ],
  resume_url: "https://drive.google.com/file/d/sample-resume-saleem/view",
  skills: ["Python", "TensorFlow", "React", "Next.js", "AI Document Intelligence", "Data Structures"],
  github_url: "https://github.com/saleemshaik2005",
  linkedin_url: "https://linkedin.com/in/saleemshaik"
};

// Faculty Mentor
export const MOCK_MENTOR_USER: UserProfile = {
  id: "378feeb5-4cd4-430e-812c-c9d95fa1734d",
  email: "shobarani_aids@cbit.ac.in",
  full_name: "Dr. Shobarani Salvadi",
  role: "mentor",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  batch_year: "Assistant Professor (Faculty Mentor 1)",
  is_lateral_entry: false,
};

// Mentor Queue filtering helper to guarantee navbar badge and verification queue match 100%
export function isSubmissionForMentor(s: StudentSubmission, mentor: UserProfile): boolean {
  if (!mentor || mentor.role !== 'mentor') return true;
  if (s.mentor_id && mentor.id && s.mentor_id === mentor.id) return true;
  if ((s as any).mentor_email && mentor.email && (s as any).mentor_email.toLowerCase() === mentor.email.toLowerCase()) return true;

  // Fallback to roll number range check if mentor_id is not explicitly populated
  const roll = s.student_roll_no;
  if (roll && roll.startsWith('160124771')) {
    const num = parseInt(roll, 10);
    if (!isNaN(num)) {
      const email = mentor.email?.toLowerCase() || '';
      const name = mentor.full_name?.toLowerCase() || '';
      if (email.includes('shobarani') || name.includes('shobha')) {
        return num >= 160124771071 && num <= 160124771093;
      }
      if (email.includes('sheena') || name.includes('sheena')) {
        return num >= 160124771094 && num <= 160124771117;
      }
      if (email.includes('srilakshmi') || name.includes('srilakshmi')) {
        return num >= 160124771118 && num <= 160124771313;
      }
    }
  }

  return false;
}

// Dynamic real-time date helpers for submissions
const getRelDate = (daysAgo: number): string => {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
};

const getRelISO = (hoursAgo: number): string => {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
};

// Mock initial approved and pending submissions across mentees
export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  // Shaik Saleem (usr-student-001) - Pending Submission 1 (Valid & Verified by AI)
  {
    id: "sub-pending-001",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    mentor_id: "dd38a4de-c509-44dd-99c6-5d98f6bb29c4",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Advanced Large Language Models & GenAI Specialization (12 Weeks)",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: getRelDate(3),
    semester: 5,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 0,
    certificate_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    file_type: "image/jpeg",
    credential_id: "NPTEL26CS928S5010948",
    verification_url: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS928S5010948",
    description: "Successfully passed the 12-week NPTEL course on Generative AI and LLM Architectures with an Elite+Gold consolidated score of 91%.",
    ai_extracted_data: {
      isDocument: true,
      certificateTitle: "NPTEL Advanced Large Language Models & GenAI Specialization",
      recipientName: "Shaik Saleem",
      issuingOrganization: "NPTEL & IIT Madras",
      completionDate: getRelDate(3),
      durationOrHours: "12 weeks",
      credentialId: "NPTEL26CS928S5010948",
      verificationUrl: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS928S5010948",
      matchedCategorySno: 1,
      matchedCategoryName: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
      matchedSubType: "12 weeks",
      suggestedPoints: 20,
      confidenceScore: 0.98,
      summary: "Official 12-Week NPTEL certification issued by IIT Madras with Elite medal verification.",
      keySkillsOrTopics: ["Large Language Models", "Transformers", "PyTorch", "Prompt Engineering"],
    },
    ai_tamper_analysis: {
      authenticityScore: 97,
      isSuspicious: false,
      manipulationRisk: "Low",
      riskPercentage: 3,
      statusLabel: "Authentic & Legitimate",
      findings: [
        "Typographic analysis: Font family and rasterization are 100% uniform across student name and date fields",
        "Digital noise check: Standard JPEG block compression throughout the document, no layer splicing",
        "Official QR & Credential ID format strictly conforms to IIT Madras NPTEL public database records",
      ],
      fontConsistency: "Consistent",
      compressionArtifacts: "Normal",
      edgeAlignment: "Natural",
      metadataCheck: "Passed",
      verifiedAt: getRelISO(3),
    },
    messages: [
      {
        id: "msg-1",
        submission_id: "sub-pending-001",
        sender_id: "usr-mentor-001",
        sender_name: "Dr. Anireddy Srilakshmi (Mentor)",
        sender_role: "mentor",
        text: "Please verify if your final proctored exam score sheet is also attached with the certificate.",
        created_at: getRelISO(3),
      },
      {
        id: "msg-2",
        submission_id: "sub-pending-001",
        sender_id: "usr-student-001",
        sender_name: "Shaik Saleem (Student)",
        sender_role: "student",
        text: "Yes Sir, the QR link contains the official consolidated marks card with 91% score. Thank you!",
        created_at: getRelISO(1),
      },
    ],
    status: "pending_mentor",
    created_at: getRelISO(4),
  },

  // Shaik Saleem (usr-student-001) - Pending Submission 2 (AI Tampering Warning / Suspicious Detection Demo)
  {
    id: "sub-pending-002",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    mentor_id: "dd38a4de-c509-44dd-99c6-5d98f6bb29c4",
    category_id: 3, // Tech Fest Organizer
    category: CBIT_24_CATEGORIES[2],
    activity_title: "National Level AI Hackathon & Tech Expo - Core Organizing Lead",
    issuing_organization: "IEEE Hyderabad Section & CBIT",
    event_date: getRelDate(5),
    semester: 5,
    academic_year: "2025-2026",
    claimed_points: 5,
    awarded_points: 0,
    certificate_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&auto=format&fit=crop&q=80",
    file_type: "image/jpeg",
    credential_id: "IEEE-HYD-ACT-98214",
    verification_url: "https://verify.ieee-hyderabad.org/cert/IEEE-HYD-ACT-98214",
    description: "Organizing Lead certificate for the 36-hour National AI Hackathon.",
    ai_extracted_data: {
      isDocument: true,
      certificateTitle: "National Level AI Hackathon & Tech Expo",
      recipientName: "Shaik Saleem",
      issuingOrganization: "IEEE Hyderabad Section",
      completionDate: getRelDate(5),
      durationOrHours: "Organizer",
      credentialId: "IEEE-HYD-ACT-98214",
      verificationUrl: "https://verify.ieee-hyderabad.org/cert/IEEE-HYD-ACT-98214",
      matchedCategorySno: 2,
      matchedCategoryName: "Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.",
      matchedSubType: "Organizer",
      suggestedPoints: 5,
      confidenceScore: 0.88,
      summary: "Participant/Organizer document for National AI Hackathon.",
      keySkillsOrTopics: ["Hackathon Organizing", "AI Leadership"],
    },
    ai_tamper_analysis: {
      authenticityScore: 38,
      isSuspicious: true,
      manipulationRisk: "High",
      riskPercentage: 84,
      statusLabel: "Suspicious / Potential Tampering",
      findings: [
        "Font weight & anti-aliasing mismatch detected specifically around the candidate name 'Shaik Saleem'",
        "Localized compression artifact boundary box detected near the signature and date area (possible digital erasure/paste)",
        "QR code redirect URL domain differs from official IEEE certificate registrar standard format",
      ],
      fontConsistency: "Mismatched",
      compressionArtifacts: "Anomalous",
      edgeAlignment: "Irregular",
      metadataCheck: "Inconsistent",
      verifiedAt: getRelISO(6),
    },
    messages: [
      {
        id: "msg-t1",
        submission_id: "sub-pending-002",
        sender_id: "usr-mentor-001",
        sender_name: "Dr. Anireddy Srilakshmi (Mentor)",
        sender_role: "mentor",
        text: "The AI forensics detector flagged a font inconsistency and compression boundary near the candidate name. Please re-check if you uploaded the original PDF certificate from IEEE.",
        created_at: getRelISO(2),
      },
    ],
    status: "pending_mentor",
    created_at: getRelISO(6),
  },

  // Mentee of Dr. Shobarani Salvadi (Roll 160124771071) - Pending Submission 3
  {
    id: "sub-pending-003",
    student_id: "usr-student-071",
    student_name: "SHRADDHA REDDY",
    student_roll_no: "160124771071",
    student_email: "shraddhareddy0249@gmail.com",
    student_section: "2",
    mentor_id: "378feeb5-4cd4-430e-812c-c9d95fa1734d",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Programming, Data Structures and Algorithms Using Python (12 Weeks)",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: getRelDate(4),
    semester: 5,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 0,
    certificate_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    file_type: "image/jpeg",
    credential_id: "NPTEL26CS710S501071",
    verification_url: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS710S501071",
    description: "Completed 12-week Python certification course through NPTEL SWAYAM.",
    ai_extracted_data: {
      isDocument: true,
      certificateTitle: "Programming, Data Structures and Algorithms Using Python",
      recipientName: "SHRADDHA REDDY",
      issuingOrganization: "NPTEL / IIT Madras",
      completionDate: getRelDate(4),
      durationOrHours: "12 weeks",
      credentialId: "NPTEL26CS710S501071",
      verificationUrl: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS710S501071",
      matchedCategorySno: 1,
      matchedCategoryName: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
      matchedSubType: "12 weeks",
      suggestedPoints: 20,
      confidenceScore: 0.96,
      summary: "Official NPTEL certificate completed with Elite status.",
      keySkillsOrTopics: ["Python", "Data Structures", "Algorithms"],
    },
    ai_tamper_analysis: {
      authenticityScore: 95,
      isSuspicious: false,
      manipulationRisk: "Low",
      riskPercentage: 5,
      statusLabel: "Authentic & Legitimate",
      findings: [
        "Font consistency verified against official NPTEL certificates",
        "Digital noise and compression artifacts uniform throughout",
      ],
      fontConsistency: "Consistent",
      compressionArtifacts: "Normal",
      edgeAlignment: "Natural",
      metadataCheck: "Passed",
      verifiedAt: getRelISO(4),
    },
    messages: [],
    status: "pending_mentor",
    created_at: getRelISO(4),
  },
  // Approved Submissions
  {
    id: "sub-001",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Deep Learning & AI Foundations 12-Week Certification",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: getRelDate(14),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "NPTEL24CS110S4020194",
    verification_url: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS110S4020194",
    status: "approved",
    mentor_remarks: "Verified with NPTEL score sheet. Excellent performance with Elite+Silver medal.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(240),
    created_at: getRelISO(260),
  },
  {
    id: "sub-002",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    category_id: 3, // Tech Fest Organizer
    category: CBIT_24_CATEGORIES[2],
    activity_title: "SUDHEE 2024 National Technical Fest - Core AI Team Lead",
    issuing_organization: "CBIT Hyderabad",
    event_date: getRelDate(25),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "CBIT/SUDHEE24/AI/045",
    verification_url: "https://sudhee.cbit.org.in/verify/AI-045",
    status: "approved",
    mentor_remarks: "Confirmed by Sudhee 2024 Faculty Convener.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(480),
    created_at: getRelISO(500),
  },
  {
    id: "sub-003",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    category_id: 14, // Blood donation / NSS
    category: CBIT_24_CATEGORIES[13],
    activity_title: "Voluntary Blood Donation Camp - Youth Red Cross Unit",
    issuing_organization: "Indian Red Cross Society & NSS CBIT",
    event_date: getRelDate(35),
    semester: 3,
    academic_year: "2025-2026",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "RCS-TS-HYD-2023-8819",
    status: "approved",
    mentor_remarks: "Blood donor certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(720),
    created_at: getRelISO(740),
  },
  {
    id: "sub-004",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    category_id: 22, // IEEE Student Chapter Member
    category: CBIT_24_CATEGORIES[21],
    activity_title: "IEEE Computer Society Student Branch Membership",
    issuing_organization: "IEEE Hyderabad Section",
    event_date: getRelDate(45),
    semester: 3,
    academic_year: "2025-2026",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "IEEE-MBR-9840129",
    verification_url: "https://www.ieee.org/membership/verify",
    status: "approved",
    mentor_remarks: "Active IEEE membership verified with membership number.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(960),
    created_at: getRelISO(980),
  },
  {
    id: "sub-005",
    student_id: "usr-student-001",
    student_name: "Shaik Saleem",
    student_roll_no: "160124771129",
    student_email: "saleemshaik2005@cbit.ac.in",
    student_section: "2",
    category_id: 13, // Innovation Projects
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Generative AI & LLM Systems Industry Internship (8-Weeks)",
    issuing_organization: "Tech Mahindra AI R&D Center",
    event_date: getRelDate(60),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "TM-AI-INTERN-2024-099",
    verification_url: "https://techmahindra.com/verify-internship",
    status: "approved",
    mentor_remarks: "Verified completion certificate and internship project evaluation report.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(1200),
    created_at: getRelISO(1240),
  },

  // A ABHINAY (usr-student-094, Mentor 2: Dr. SHEENA MOHAMMED)
  {
    id: "sub-006",
    student_id: "usr-student-094",
    student_name: "A ABHINAY",
    student_roll_no: "160124771094",
    student_email: "abhinay13570@gmail.com",
    student_section: "2",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Cloud Computing & Distributed Architecture 12-Week Course",
    issuing_organization: "NPTEL / IIT Kharagpur (SWAYAM)",
    event_date: getRelDate(75),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    credential_id: "NPTEL24CS891S3010192",
    verification_url: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS891S3010192",
    status: "approved",
    mentor_remarks: "Verified certificate with 84% consolidated score.",
    approved_by: "usr-mentor-002",
    approver_name: "Dr. SHEENA MOHAMMED",
    approved_at: getRelISO(1500),
    created_at: getRelISO(1550),
  },
  {
    id: "sub-007",
    student_id: "usr-student-094",
    student_name: "A ABHINAY",
    student_roll_no: "160124771094",
    student_email: "abhinay13570@gmail.com",
    student_section: "2",
    category_id: 13, // Innovation Projects / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Cloud Infrastructure & DevOps Summer Internship (6-Weeks)",
    issuing_organization: "Wipro Technologies Hyderabad",
    event_date: getRelDate(90),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Internship letter and mentor evaluation report verified.",
    approved_by: "usr-mentor-002",
    approver_name: "Dr. SHEENA MOHAMMED",
    approved_at: getRelISO(1800),
    created_at: getRelISO(1850),
  },
  {
    id: "sub-008",
    student_id: "usr-student-094",
    student_name: "A ABHINAY",
    student_roll_no: "160124771094",
    student_email: "abhinay13570@gmail.com",
    student_section: "2",
    category_id: 4, // Tech Fest Participant
    category: CBIT_24_CATEGORIES[3],
    activity_title: "Smart India Hackathon (SIH) Campus Edition Participant",
    issuing_organization: "CBIT Hackathon Club",
    event_date: getRelDate(100),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 3,
    awarded_points: 3,
    certificate_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "SIH participation verified.",
    approved_by: "usr-mentor-002",
    approver_name: "Dr. SHEENA MOHAMMED",
    approved_at: getRelISO(2000),
    created_at: getRelISO(2050),
  },

  // MOHAMMAD ASLAM (usr-student-310, Lateral Entry, Mentor 3: Dr. Anireddy Srilakshmi)
  {
    id: "sub-009",
    student_id: "usr-student-310",
    student_name: "MOHAMMAD ASLAM",
    student_roll_no: "160124771310",
    student_email: "mohammadaslam61710@gmail.com",
    student_section: "2",
    category_id: 2, // MOOCs 8 weeks
    category: CBIT_24_CATEGORIES[1],
    activity_title: "NPTEL Introduction to Internet of Things (IoT) 8-Week Course",
    issuing_organization: "NPTEL / IIT Kharagpur (SWAYAM)",
    event_date: getRelDate(110),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 16,
    awarded_points: 16,
    certificate_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "NPTEL Certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(2200),
    created_at: getRelISO(2250),
  },
  {
    id: "sub-010",
    student_id: "usr-student-310",
    student_name: "MOHAMMAD ASLAM",
    student_roll_no: "160124771310",
    student_email: "mohammadaslam61710@gmail.com",
    student_section: "2",
    category_id: 13, // Innovation / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Full-Stack Web Development & Cloud Internship (8-Weeks)",
    issuing_organization: "Infosys Springboard / Campus Connect",
    event_date: getRelDate(120),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Infosys Springboard internship verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(2400),
    created_at: getRelISO(2450),
  },
  {
    id: "sub-011",
    student_id: "usr-student-310",
    student_name: "MOHAMMAD ASLAM",
    student_roll_no: "160124771310",
    student_email: "mohammadaslam61710@gmail.com",
    student_section: "2",
    category_id: 16, // Sports
    category: CBIT_24_CATEGORIES[15],
    activity_title: "Inter-College Cricket Tournament Runners-Up",
    issuing_organization: "CBIT Physical Education Department",
    event_date: getRelDate(130),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Sports participation confirmed.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Anireddy Srilakshmi",
    approved_at: getRelISO(2600),
    created_at: getRelISO(2650),
  },

  // SAMA ASHWITHA REDDY (usr-student-089, Mentor 1: Dr. Shobarani Salvadi)
  {
    id: "sub-012",
    student_id: "usr-student-089",
    student_name: "SAMA ASHWITHA REDDY",
    student_roll_no: "160124771089",
    student_email: "samaashwithareddy@gmail.com",
    student_section: "2",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Natural Language Processing & Large Language Models",
    issuing_organization: "NPTEL / IIT Madras (SWAYAM)",
    event_date: getRelDate(140),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Elite+Gold certificate verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Shobarani Salvadi",
    approved_at: getRelISO(2800),
    created_at: getRelISO(2850),
  },
  {
    id: "sub-013",
    student_id: "usr-student-089",
    student_name: "SAMA ASHWITHA REDDY",
    student_roll_no: "160124771089",
    student_email: "samaashwithareddy@gmail.com",
    student_section: "2",
    category_id: 13, // Innovation / Internship
    category: CBIT_24_CATEGORIES[12],
    activity_title: "Data Science & Machine Learning Research Internship (8-Weeks)",
    issuing_organization: "TCS Research & Innovation Labs",
    event_date: getRelDate(150),
    semester: 4,
    academic_year: "2025-2026",
    claimed_points: 20,
    awarded_points: 20,
    certificate_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "TCS Research internship verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. Shobarani Salvadi",
    approved_at: getRelISO(3000),
    created_at: getRelISO(3050),
  }
];

export interface DepartmentStudent {
  id: string;
  name: string;
  roll: string;
  section: string;
  email: string;
  mentor: string;
  mentorEmail: string;
  points: number;
  target: number;
  maxCap: number;
  isLateral: boolean;
  status: 'Satisfied' | 'In Progress' | 'At Risk';
  nptelDone: boolean;
  internshipDone: boolean;
  resumeUrl?: string;
  skills: string[];
}

export interface FacultyMentorDetail {
  id: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  email: string;
  phone?: string;
  cabin: string;
  menteeCount: number;
  pendingReviews: number;
  approvedReviews: number;
  averagePoints: number;
  complianceRate: number;
  mentees: DepartmentStudent[];
}

// Canonical 67-Student Roster for CBIT AI&DS Section 2 (Batch 2024-2028, 5th Semester)
export const DEPARTMENT_ALL_STUDENTS: DepartmentStudent[] = [
  // --- MENTOR 1: Dr. Shobarani Salvadi (22 Students, Rolls 160124771071 - 160124771093) ---
  { id: "usr-student-071", name: "SHRADDHA REDDY", roll: "160124771071", section: "2", email: "shraddhareddy0249@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Python", "Machine Learning", "SQL"] },
  { id: "usr-student-072", name: "BHARATULA SAI NIKHILA", roll: "160124771072", section: "2", email: "sainikhilabh@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 55, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Java", "Web Development", "DBMS"] },
  { id: "usr-student-073", name: "DEEKSHA BACHU", roll: "160124771073", section: "2", email: "bachu.deeksha@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Data Analytics", "Tableau", "Python"] },
  { id: "usr-student-074", name: "G DOLA GOURI", roll: "160124771074", section: "2", email: "dolagouri12@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 48, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Data Structures", "Git"] },
  { id: "usr-student-076", name: "G L SRI SAHASRA RAO", roll: "160124771076", section: "2", email: "sahasrarao1506@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 64, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud Computing", "AWS", "Python"] },
  { id: "usr-student-077", name: "KAMERA BHAVANI", roll: "160124771077", section: "2", email: "bhavanikamera123@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 26, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["C Programming", "Basics"] },
  { id: "usr-student-078", name: "K VEEKSHA", roll: "160124771078", section: "2", email: "k.veeksha@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 52, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Web Development", "React", "CSS"] },
  { id: "usr-student-079", name: "LAKKEPURAM LAASYASRI", roll: "160124771079", section: "2", email: "laasyasrilakkepuram@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 61, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Deep Learning", "PyTorch", "OpenCV"] },
  { id: "usr-student-080", name: "MADESHI NANDINI", roll: "160124771080", section: "2", email: "madeshinandini@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 58, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Java", "SQL", "DBMS"] },
  { id: "usr-student-081", name: "MASETTY SRI THARINI", roll: "160124771081", section: "2", email: "sritharinimasetty@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 65, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Computer Vision", "OpenCV", "TensorFlow"] },
  { id: "usr-student-082", name: "MUDAVATH SRAVANI", roll: "160124771082", section: "2", email: "mudavathsravani16@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 45, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "HTML", "CSS"] },
  { id: "usr-student-083", name: "NAYUDU LIKITHA", roll: "160124771083", section: "2", email: "nayudulikitha28@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 24, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Data Structures", "C"] },
  { id: "usr-student-084", name: "PACHIMATLA HASINI", roll: "160124771084", section: "2", email: "pachimatlahasini06@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["NLP", "Transformers", "Python"] },
  { id: "usr-student-085", name: "PARSHETTY HARSHITHA", roll: "160124771085", section: "2", email: "harshithaofficial2028@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 56, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Frontend", "JavaScript", "React"] },
  { id: "usr-student-086", name: "PRANATHI VEMURI", roll: "160124771086", section: "2", email: "pranathivemuri.18@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 63, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Python", "Django", "PostgreSQL"] },
  { id: "usr-student-087", name: "RAYAPENENI VYSHNAVI", roll: "160124771087", section: "2", email: "rayapaneni.vyshnavi23@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 50, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Machine Learning", "Scikit-Learn"] },
  { id: "usr-student-088", name: "RHUTHVIJA ALLAVALA", roll: "160124771088", section: "2", email: "rhuthvija@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Full Stack", "Node.js", "Express"] },
  { id: "usr-student-089", name: "SAMA ASHWITHA REDDY", roll: "160124771089", section: "2", email: "samaashwithareddy@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Data Science", "Pandas", "NumPy"] },
  { id: "usr-student-090", name: "S BRAMARAMBIKA", roll: "160124771090", section: "2", email: "Bramarambika81@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 54, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "SQL", "Data Analysis"] },
  { id: "usr-student-091", name: "VADDEBOINA MAHATHI", roll: "160124771091", section: "2", email: "mahathivaddeboina19@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud", "Docker", "DevOps"] },
  { id: "usr-student-092", name: "VALLABHDAS VAISHNAVI", roll: "160124771092", section: "2", email: "vallabhdasvaishnavi0120@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 58, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["C++", "Algorithms", "OOP"] },
  { id: "usr-student-093", name: "VENNELA INDUKURI", roll: "160124771093", section: "2", email: "vennela.indukuri@gmail.com", mentor: "Dr. Shobarani Salvadi", mentorEmail: "shobarani_aids@cbit.ac.in", points: 65, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["AI", "Neural Networks", "Python"] },

  // --- MENTOR 2: Dr. SHEENA MOHAMMED (22 Students, Rolls 160124771094 - 160124771117) ---
  { id: "usr-student-094", name: "A ABHINAY", roll: "160124771094", section: "2", email: "abhinay13570@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 63, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud Architecture", "AWS", "DevOps"] },
  { id: "usr-student-095", name: "A MURALIDHAR REDDY", roll: "160124771095", section: "2", email: "amaravadimuralidhar@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 55, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "FastAPI", "PostgreSQL"] },
  { id: "usr-student-097", name: "ANUMULLA HANNISH REDDI", roll: "160124771097", section: "2", email: "hannishanumulla@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Data Engineering", "Apache Spark", "SQL"] },
  { id: "usr-student-098", name: "ATTIPALLI HOTHRISH REDDY", roll: "160124771098", section: "2", email: "reddyhothrish0@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 52, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["React", "TypeScript", "Tailwind CSS"] },
  { id: "usr-student-099", name: "B KESHAV BHANDARI", roll: "160124771099", section: "2", email: "b.keshavbhandari19@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 61, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Java", "Spring Boot", "Microservices"] },
  { id: "usr-student-100", name: "BADAVATH BABINAYAK", roll: "160124771100", section: "2", email: "bbabinayak29@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 46, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "SQL", "Data Modeling"] },
  { id: "usr-student-101", name: "BANOTHU RAKESH", roll: "160124771101", section: "2", email: "rakeshbanothu1101@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 25, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["C", "Basic Electronics"] },
  { id: "usr-student-102", name: "BHATTA TEJA PRAHARSHA", roll: "160124771102", section: "2", email: "tejapraharsha23@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Machine Learning", "TensorFlow", "Keras"] },
  { id: "usr-student-103", name: "BODA ARUN", roll: "160124771103", section: "2", email: "bodaarun29@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 50, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Web Development", "Node.js", "Express"] },
  { id: "usr-student-104", name: "C VARUN TEJA", roll: "160124771104", section: "2", email: "varuntejacherukuthota.0456@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 64, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["DevOps", "Kubernetes", "CI/CD"] },
  { id: "usr-student-105", name: "D RISHWANTH REDDY", roll: "160124771105", section: "2", email: "rishwanthreddyd9@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 58, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Computer Vision", "OpenCV"] },
  { id: "usr-student-106", name: "DASARI HITHARTH", roll: "160124771106", section: "2", email: "dasarihitharth@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Data Structures", "C++", "STL"] },
  { id: "usr-student-107", name: "EEDEBILLI SAIMOHAN", roll: "160124771107", section: "2", email: "mohansai152006@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 54, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Next.js", "React", "Frontend"] },
  { id: "usr-student-108", name: "GADE SAI TEJA", roll: "160124771108", section: "2", email: "gadesaiteja83@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 63, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud Computing", "GCP", "Kubernetes"] },
  { id: "usr-student-109", name: "GADE VISHAL", roll: "160124771109", section: "2", email: "gadevishal010107@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 51, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Pandas", "Analytics"] },
  { id: "usr-student-110", name: "GADIELA KARTHIK REDDY", roll: "160124771110", section: "2", email: "karthikreddyg0507@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 28, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Programming Fundamentals"] },
  { id: "usr-student-111", name: "G YUVA AKHILESH REDDY", roll: "160124771111", section: "2", email: "yuvaakhilesh@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 65, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["NLP", "AI Systems", "PyTorch"] },
  { id: "usr-student-112", name: "KALYANAM SRI SAI AKARSH", roll: "160124771112", section: "2", email: "kalyanamakarsh@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 56, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Cybersecurity", "Network Protocols"] },
  { id: "usr-student-113", name: "KETIREDDI CHIRANJEEVI", roll: "160124771113", section: "2", email: "chiranjeeviketireddi7279@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Data Mining", "SQL", "PowerBI"] },
  { id: "usr-student-114", name: "KONDALA KARTHIK", roll: "160124771114", section: "2", email: "karthikkondala1@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 48, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Frontend", "UI/UX Design"] },
  { id: "usr-student-116", name: "MALLEPALLY PRAVEEN", roll: "160124771116", section: "2", email: "mallepallypraveen5767@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Full Stack", "MongoDB", "Node.js"] },
  { id: "usr-student-117", name: "MANDALA VISWA TEJA", roll: "160124771117", section: "2", email: "viswatejamandala@gmail.com", mentor: "Dr. SHEENA MOHAMMED", mentorEmail: "sheena_it@cbit.ac.in", points: 57, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Docker", "DevOps"] },

  // --- MENTOR 3: Dr. Anireddy Srilakshmi (23 Students: 17 Regular + 6 Lateral Entry) ---
  { id: "usr-student-118", name: "M KOUSHIK RAM REDDY", roll: "160124771118", section: "2", email: "koushikramreddy.mogusala@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Deep Learning", "PyTorch", "CUDA"] },
  { id: "usr-student-119", name: "MD HAMZA JAWEED", roll: "160124771119", section: "2", email: "hamza1jaweed@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 54, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Data Analytics", "Python", "Tableau"] },
  { id: "usr-student-120", name: "MOMULA GOUTHAM", roll: "160124771120", section: "2", email: "momulagoutham123@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud Architecture", "AWS", "Terraform"] },
  { id: "usr-student-121", name: "NANNA AADARSH", roll: "160124771121", section: "2", email: "nannaaadarsh158@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 50, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Web Development", "React", "TypeScript"] },
  { id: "usr-student-122", name: "NAYUNIPATRUNI MOHITH", roll: "160124771122", section: "2", email: "nayunipatrunimohith@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 63, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Machine Learning", "Scikit", "Python"] },
  { id: "usr-student-123", name: "NIJJANI VARUN TEJA", roll: "160124771123", section: "2", email: "varuntejav538@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 55, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Django", "REST APIs"] },
  { id: "usr-student-124", name: "PAMARTHI MANIDEEP", roll: "160124771124", section: "2", email: "manideeppamarthi@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 22, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["C", "Basic Algorithms"] },
  { id: "usr-student-125", name: "PANJALA YESHWANTH GOUD", roll: "160124771125", section: "2", email: "yeshwanthgoud06@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 61, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Full Stack", "Node.js", "React"] },
  { id: "usr-student-126", name: "R SAI HARSHITH", roll: "160124771126", section: "2", email: "raghavapuramharshith@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 56, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Data Structures", "Java", "Algorithms"] },
  { id: "usr-student-127", name: "R SRISHANTH REDDY", roll: "160124771127", section: "2", email: "srishanthreddy5212@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 64, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["DevOps", "Docker", "Linux"] },
  { id: "usr-student-128", name: "SHAIK IRFAN", roll: "160124771128", section: "2", email: "irfanshaik75433@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 58, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["SQL", "Database Systems", "Python"] },
  { id: "usr-student-001", name: "SHAIK SALEEM", roll: "160124771129", section: "2", email: "saleemshaik2005@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 55, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: true, resumeUrl: "https://drive.google.com/file/d/sample-resume-saleem/view", skills: ["Python", "TensorFlow", "React", "AI OCR", "SQL"] },
  { id: "usr-student-130", name: "SUNKOJU SHASHIKANTH", roll: "160124771130", section: "2", email: "sunkojushashikanth@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 60, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Cloud", "Kubernetes", "AWS"] },
  { id: "usr-student-131", name: "T R SREE SHANMUKH", roll: "160124771131", section: "2", email: "thotaramakrishnasreeshanmukh@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 52, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Java", "Spring Boot", "Microservices"] },
  { id: "usr-student-132", name: "UPPU SHIVA CHAITANYA", roll: "160124771132", section: "2", email: "Chaithanyauppu1@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 62, target: 60, maxCap: 100, isLateral: false, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Computer Vision", "OpenCV", "Python"] },
  { id: "usr-student-133", name: "YAKUB ALI MOHAMMAD", roll: "160124771133", section: "2", email: "mohd.yakub7780@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 50, target: 60, maxCap: 100, isLateral: false, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Python", "Data Science", "SQL"] },
  { id: "usr-student-134", name: "YERRA BABBLU", roll: "160124771134", section: "2", email: "babbluyerra4@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 25, target: 60, maxCap: 100, isLateral: false, status: "At Risk", nptelDone: false, internshipDone: false, skills: ["Web Basics", "HTML", "CSS"] },

  // --- LATERAL ENTRY (DIPLOMA) STUDENTS -> Mentor 3: Dr. Anireddy Srilakshmi (Target: 45, Cap: 75) ---
  { id: "usr-student-308", name: "AMANCHI SAI SREEJA", roll: "160124771308", section: "2", email: "saisreeja2747@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 48, target: 45, maxCap: 75, isLateral: true, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Electronics Interfacing", "Python", "Sensors"] },
  { id: "usr-student-309", name: "KONDA SHREYA", roll: "160124771309", section: "2", email: "shreyakonda10@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 38, target: 45, maxCap: 75, isLateral: true, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Java", "SQL", "Database Design"] },
  { id: "usr-student-310", name: "MOHAMMAD ASLAM", roll: "160124771310", section: "2", email: "mohammadaslam61710@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 46, target: 45, maxCap: 75, isLateral: true, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["IoT Systems", "Full-Stack Web", "C++"] },
  { id: "usr-student-311", name: "VARIKUPPULA PAVAN", roll: "160124771311", section: "2", email: "pavankumarvarikuppala@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 36, target: 45, maxCap: 75, isLateral: true, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Network Engineering", "Linux", "Security"] },
  { id: "usr-student-312", name: "GUNDLA AMRUTHARAJU", roll: "160124771312", section: "2", email: "amruthbunny24@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 47, target: 45, maxCap: 75, isLateral: true, status: "Satisfied", nptelDone: true, internshipDone: true, skills: ["Embedded C", "Robotics", "Microcontrollers"] },
  { id: "usr-student-313", name: "MD ABDUL SAMEER HASHMI", roll: "160124771313", section: "2", email: "basheerhashmi4105@gmail.com", mentor: "Dr. Anireddy Srilakshmi", mentorEmail: "srilakshmia_aids@cbit.ac.in", points: 40, target: 45, maxCap: 75, isLateral: true, status: "In Progress", nptelDone: true, internshipDone: false, skills: ["Data Analysis", "Python", "NumPy"] },
];

// Exactly 3 Designated Faculty Mentors of AI&DS Section 2
export const DEPARTMENT_FACULTY_MENTORS: FacultyMentorDetail[] = [
  {
    id: "fm-01",
    name: "Dr. Shobarani Salvadi",
    designation: "Assistant Professor & Faculty Mentor 1",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "shobarani_aids@cbit.ac.in",
    cabin: "AI&DS Block, Room 302",
    menteeCount: 22,
    pendingReviews: 1,
    approvedReviews: 44,
    averagePoints: 52.1,
    complianceRate: 86.4,
    mentees: DEPARTMENT_ALL_STUDENTS.filter((s) => s.mentor === "Dr. Shobarani Salvadi"),
  },
  {
    id: "fm-02",
    name: "Dr. SHEENA MOHAMMED",
    designation: "Assistant Professor & Faculty Mentor 2",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "sheena_it@cbit.ac.in",
    cabin: "IT / AI&DS Block, Room 204",
    menteeCount: 22,
    pendingReviews: 0,
    approvedReviews: 42,
    averagePoints: 53.5,
    complianceRate: 90.9,
    mentees: DEPARTMENT_ALL_STUDENTS.filter((s) => s.mentor === "Dr. SHEENA MOHAMMED"),
  },
  {
    id: "fm-03",
    name: "Dr. Anireddy Srilakshmi",
    designation: "Assistant Professor & Faculty Mentor 3",
    department: "Artificial Intelligence and Data Science (AI&DS)",
    section: "2",
    email: "srilakshmia_aids@cbit.ac.in",
    cabin: "AI&DS Block, Room 304",
    menteeCount: 23,
    pendingReviews: 2,
    approvedReviews: 48,
    averagePoints: 54.0,
    complianceRate: 87.0,
    mentees: DEPARTMENT_ALL_STUDENTS.filter((s) => s.mentor === "Dr. Anireddy Srilakshmi"),
  },
];
