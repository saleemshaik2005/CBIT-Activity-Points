import { ActivityCategory, UserProfile, StudentSubmission } from '@/types';

export const CBIT_COLLEGE_NAME = "CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)";
export const CBIT_COLLEGE_CODE = "HYDERABAD-75";
export const MAR_DOCUMENT_TITLE = "Record of Activities for Mandatory Additional Requirements";

export const DEFAULT_REGULAR_TARGET_POINTS = 60;
export const DEFAULT_LATERAL_ENTRY_TARGET_POINTS = 50;

export const CBIT_24_CATEGORIES: ActivityCategory[] = [
  {
    id: 1,
    sno: 1,
    name: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
    sub_type: "12 weeks",
    default_points: 20,
    max_points_allowed: 40,
    description: "Online certification courses of 12-week duration from Swayam, NPTEL, Coursera, edX, etc.",
    is_active: true,
  },
  {
    id: 2,
    sno: 1,
    name: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
    sub_type: "8 weeks",
    default_points: 16,
    max_points_allowed: 40,
    description: "Online certification courses of 8-week duration from Swayam, NPTEL, Coursera, etc.",
    is_active: true,
  },
  {
    id: 3,
    sno: 2,
    name: "Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.",
    sub_type: "Organizer",
    default_points: 5,
    max_points_allowed: 10,
    description: "Organizing committee member for Technical Fest, R&D Day, Workshops, Hackathons, or Conferences.",
    is_active: true,
  },
  {
    id: 4,
    sno: 2,
    name: "Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.",
    sub_type: "Participant",
    default_points: 3,
    max_points_allowed: 6,
    description: "Participant in Technical Fest, Research Day, Hackathons, Competitions or Technical Workshops.",
    is_active: true,
  },
  {
    id: 5,
    sno: 3,
    name: "Rural Reporting",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Conducting surveys, village impact assessment, and submitting rural field reporting documentation.",
    is_active: true,
  },
  {
    id: 6,
    sno: 4,
    name: "Harithaharam /plantation",
    sub_type: "General",
    default_points: 1,
    max_points_allowed: 5,
    description: "Active participation in Harithaharam plantation drives and environmental greening initiatives.",
    is_active: true,
  },
  {
    id: 7,
    sno: 5,
    name: "Participation in Relief camps",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 40,
    description: "Volunteering in disaster relief operations, flood relief, emergency assistance camps.",
    is_active: true,
  },
  {
    id: 8,
    sno: 6,
    name: "Participation in Debate/ Group Discussion/ Technical Quiz",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Participating in formal Debate, Group Discussion (GD), or Technical Quiz tournaments.",
    is_active: true,
  },
  {
    id: 9,
    sno: 7,
    name: "Publication in News Paper, Magazines in institution level (Magazine / article/internet)",
    sub_type: "Editor",
    default_points: 10,
    max_points_allowed: 20,
    description: "Chief/Section Editor of official college magazine, newsletter, or departmental technical journal.",
    is_active: true,
  },
  {
    id: 10,
    sno: 7,
    name: "Publication in News Paper, Magazines in institution level (Magazine / article/internet)",
    sub_type: "Writer",
    default_points: 5,
    max_points_allowed: 10,
    description: "Article writer or contributor to institutional publications, newsletters, or online portals.",
    is_active: true,
  },
  {
    id: 11,
    sno: 8,
    name: "Publication in News Paper, Magazine & Blogs",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "External articles published in reputable national/regional newspapers, magazines, or tech blogs.",
    is_active: true,
  },
  {
    id: 12,
    sno: 9,
    name: "Research Publication (per publication)",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Published research paper in IEEE, Scopus, UGC-CARE indexed journals or peer-reviewed conferences.",
    is_active: true,
  },
  {
    id: 13,
    sno: 10,
    name: "Innovation Projects (other than course requirements)",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 40,
    description: "Patents, working prototypes, smart hardware/software solutions developed outside curriculum.",
    is_active: true,
  },
  {
    id: 14,
    sno: 11,
    name: "Blood donation /NSS or NCC participation",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Voluntary blood donation or verified participation in National Service Scheme (NSS) / NCC camps.",
    is_active: true,
  },
  {
    id: 15,
    sno: 12,
    name: "Blood donation/NSS camp organization",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Leading the coordination, logistics, and organizing of on-campus blood donation or social camps.",
    is_active: true,
  },
  {
    id: 16,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "College level",
    default_points: 5,
    max_points_allowed: 10,
    description: "Representing class or branch in inter-departmental CBIT annual sports meet.",
    is_active: true,
  },
  {
    id: 17,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "University level",
    default_points: 10,
    max_points_allowed: 20,
    description: "Representing the college in inter-university sports competitions or tournaments.",
    is_active: true,
  },
  {
    id: 18,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "Region level",
    default_points: 12,
    max_points_allowed: 24,
    description: "Regional zonal sports events and state-level preliminary tournaments.",
    is_active: true,
  },
  {
    id: 19,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "State level",
    default_points: 15,
    max_points_allowed: 30,
    description: "State-level championship representation in athletics, team sports, or indoor games.",
    is_active: true,
  },
  {
    id: 20,
    sno: 13,
    name: "Participation in Sports/Games",
    sub_type: "National level",
    default_points: 20,
    max_points_allowed: 20,
    description: "National championship or Khelo India university games representation with official certificate.",
    is_active: true,
  },
  {
    id: 21,
    sno: 14,
    name: "Cultural Programme (Dance, Drama, Elocution, Music etc. )",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Performance in dance, drama, theatre, elocution, music, or cultural fest competitions.",
    is_active: true,
  },
  {
    id: 22,
    sno: 15,
    name: "Member of Professional Society",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Active membership in IEEE, CSI, IETE, ACM, ASME, SAE, ISTE, or equivalent professional bodies.",
    is_active: true,
  },
  {
    id: 23,
    sno: 16,
    name: "Student Chapter /Cubs",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Active executive or core team member in recognized campus student chapters and technical clubs.",
    is_active: true,
  },
  {
    id: 24,
    sno: 17,
    name: "Relevant Industry Visit & Report",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Authorized industrial tour visit with documented technical observation report submitted to department.",
    is_active: true,
  },
  {
    id: 25,
    sno: 18,
    name: "Photography activities in different Clubs (Photography club, Cine club)",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Official coverage for institutional events, photography competitions, or film club exhibits.",
    is_active: true,
  },
  {
    id: 26,
    sno: 19,
    name: "Participation in Yoga camp",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Attending verified Yoga, meditation, or wellness camps with issued completion certificate.",
    is_active: true,
  },
  {
    id: 27,
    sno: 20,
    name: "Self-Entrepreneurship Program",
    sub_type: "General",
    default_points: 20,
    max_points_allowed: 20,
    description: "Incubated startup, MSME registration, angel pitch participation, or self-venture launch.",
    is_active: true,
  },
  {
    id: 28,
    sno: 21,
    name: "Adventure sports with Certification",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Certified trekking, mountaineering, scuba diving, paragliding, or state youth adventure programs.",
    is_active: true,
  },
  {
    id: 29,
    sno: 22,
    name: "Training to under privileged Physically challenged",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "Dedicated teaching or skill development training for underprivileged children or disabled individuals.",
    is_active: true,
  },
  {
    id: 30,
    sno: 23,
    name: "Community Service & Allied Activities",
    sub_type: "General",
    default_points: 10,
    max_points_allowed: 20,
    description: "NGO volunteering, environmental cleanliness drives, civic awareness, or community development.",
    is_active: true,
  },
  {
    id: 31,
    sno: 24,
    name: "Class Representative",
    sub_type: "General",
    default_points: 5,
    max_points_allowed: 10,
    description: "Formally elected/nominated Class Representative (CR) discharging responsibilities for academic year.",
    is_active: true,
  }
];

// Helper to calculate total verified points considering category caps
export function calculateStudentMARProgress(
  submissions: StudentSubmission[],
  categories: ActivityCategory[] = CBIT_24_CATEGORIES,
  targetPoints: number = DEFAULT_REGULAR_TARGET_POINTS
) {
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const pendingSubmissions = submissions.filter(s => s.status === 'pending_mentor');

  // Group by category SNo to enforce max_points_allowed per category
  const categoryPointsMap = new Map<number, number>();
  const categoryMaxMap = new Map<number, number>();

  categories.forEach(cat => {
    categoryMaxMap.set(cat.sno, Math.max(categoryMaxMap.get(cat.sno) || 0, cat.max_points_allowed));
  });

  approvedSubmissions.forEach(sub => {
    const cat = categories.find(c => c.id === sub.category_id);
    const sno = cat ? cat.sno : 1;
    const current = categoryPointsMap.get(sno) || 0;
    categoryPointsMap.set(sno, current + (sub.awarded_points || sub.claimed_points || 0));
  });

  // Calculate capped total
  let totalApprovedPoints = 0;
  let totalUncappedApprovedPoints = 0;

  categoryPointsMap.forEach((pts, sno) => {
    totalUncappedApprovedPoints += pts;
    const maxAllowed = categoryMaxMap.get(sno) || 40;
    totalApprovedPoints += Math.min(pts, maxAllowed);
  });

  let totalPendingPoints = 0;
  pendingSubmissions.forEach(sub => {
    totalPendingPoints += (sub.claimed_points || 0);
  });

  const percentage = Math.min(100, Math.round((totalApprovedPoints / targetPoints) * 100));
  const isCompleted = totalApprovedPoints >= targetPoints;
  const pointsRemaining = Math.max(0, targetPoints - totalApprovedPoints);

  // Semester breakdown (I to VIII)
  const semesterMap: { [sem: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  approvedSubmissions.forEach(sub => {
    if (sub.semester >= 1 && sub.semester <= 8) {
      semesterMap[sub.semester] = (semesterMap[sub.semester] || 0) + (sub.awarded_points || sub.claimed_points || 0);
    }
  });

  return {
    totalApprovedPoints,
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

// Mock initial data for testing right away before Supabase connect
export const MOCK_CURRENT_USER: UserProfile = {
  id: "usr-student-001",
  email: "rahul.sharma@cbit.ac.in",
  full_name: "Rahul Sharma",
  role: "student",
  roll_number: "160122733045",
  department: "Computer Science & Engineering",
  section: "CSE-1",
  batch_year: "2022-2026",
  is_lateral_entry: false,
  mentor_id: "usr-mentor-001",
  mentor_name: "Dr. K. Radhika (Assoc. Prof)",
  phone_number: "+91 98765 43210"
};

export const MOCK_MENTOR_USER: UserProfile = {
  id: "usr-mentor-001",
  email: "kradhika.cse@cbit.ac.in",
  full_name: "Dr. K. Radhika",
  role: "mentor",
  department: "Computer Science & Engineering",
  batch_year: "Faculty",
  is_lateral_entry: false,
};

export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub-001",
    student_id: "usr-student-001",
    student_name: "Rahul Sharma",
    student_roll_no: "160122733045",
    category_id: 1, // MOOCs 12 weeks
    category: CBIT_24_CATEGORIES[0],
    activity_title: "NPTEL Cloud Computing 12-Week Certification",
    issuing_organization: "NPTEL / IIT Kharagpur",
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
    approver_name: "Dr. K. Radhika",
    approved_at: "2024-05-02T10:30:00Z",
    created_at: "2024-05-01T08:15:00Z"
  },
  {
    id: "sub-002",
    student_id: "usr-student-001",
    student_name: "Rahul Sharma",
    student_roll_no: "160122733045",
    category_id: 3, // Tech Fest Organizer
    category: CBIT_24_CATEGORIES[2],
    activity_title: "SUDHEE 2024 Technical Fest - Core Web Team Lead",
    issuing_organization: "CBIT Hyderabad",
    event_date: "2024-03-15",
    semester: 4,
    academic_year: "2023-2024",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Confirmed by Sudhee 2024 Staff Convener.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. K. Radhika",
    approved_at: "2024-03-20T14:20:00Z",
    created_at: "2024-03-18T11:00:00Z"
  },
  {
    id: "sub-003",
    student_id: "usr-student-001",
    student_name: "Rahul Sharma",
    student_roll_no: "160122733045",
    category_id: 14, // Blood donation NSS
    category: CBIT_24_CATEGORIES[13],
    activity_title: "Annual Mega Blood Donation Camp at CBIT Open Air Theatre",
    issuing_organization: "Red Cross Society & NSS CBIT",
    event_date: "2024-08-15",
    semester: 5,
    academic_year: "2024-2025",
    claimed_points: 5,
    awarded_points: 0,
    certificate_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "pending_mentor",
    created_at: "2024-08-16T09:45:00Z"
  },
  {
    id: "sub-004",
    student_id: "usr-student-001",
    student_name: "Rahul Sharma",
    student_roll_no: "160122733045",
    category_id: 22, // Member of Professional Society
    category: CBIT_24_CATEGORIES[21],
    activity_title: "IEEE Computer Society Student Member 2024-2025",
    issuing_organization: "IEEE Hyderabad Section",
    event_date: "2024-01-10",
    semester: 4,
    academic_year: "2023-2024",
    claimed_points: 5,
    awarded_points: 5,
    certificate_url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=60",
    file_type: "image/jpeg",
    status: "approved",
    mentor_remarks: "Membership card verified.",
    approved_by: "usr-mentor-001",
    approver_name: "Dr. K. Radhika",
    approved_at: "2024-01-15T16:00:00Z",
    created_at: "2024-01-12T12:00:00Z"
  }
];
