import fs from 'fs';
import path from 'path';
import { StudentSubmission, UserProfile, ActivityCategory, SystemSettings, NotificationItem } from '@/types';
import { CBIT_24_CATEGORIES, MOCK_SUBMISSIONS, DEFAULT_REGULAR_TARGET_POINTS, DEFAULT_REGULAR_MAX_POINTS, DEFAULT_LATERAL_ENTRY_TARGET_POINTS, DEFAULT_LATERAL_ENTRY_MAX_POINTS, CBIT_COLLEGE_NAME, CBIT_COLLEGE_CODE } from './mar-constants';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cbit_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export interface ServerDatabase {
  submissions: StudentSubmission[];
  profiles: Record<string, UserProfile>;
  categories: ActivityCategory[];
  settings: SystemSettings;
  notifications: NotificationItem[];
  lastUpdated: string;
}

// Generate realistic real-time dates relative to current date
function getRelativeDateString(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

function getRelativeISOString(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
}

export function getInitialRealtimeSubmissions(): StudentSubmission[] {
  // Use MOCK_SUBMISSIONS but normalize all dates to be real-time and relevant
  return MOCK_SUBMISSIONS.map((sub, index) => {
    let createdHoursAgo = 4;
    let eventDaysAgo = 3;

    if (sub.status === 'pending_mentor') {
      createdHoursAgo = index === 0 ? 2 : 5;
      eventDaysAgo = index === 0 ? 3 : 7;
    } else {
      createdHoursAgo = 24 * (index + 2);
      eventDaysAgo = index + 5;
    }

    const createdAt = getRelativeISOString(createdHoursAgo);
    const eventDate = getRelativeDateString(eventDaysAgo);

    return {
      ...sub,
      event_date: eventDate,
      created_at: createdAt,
      approved_at: sub.approved_at ? getRelativeISOString(createdHoursAgo - 12) : undefined,
      academic_year: '2025-2026',
      ai_tamper_analysis: sub.ai_tamper_analysis
        ? {
            ...sub.ai_tamper_analysis,
            verifiedAt: createdAt,
          }
        : undefined,
      ai_extracted_data: sub.ai_extracted_data
        ? {
            ...sub.ai_extracted_data,
            completionDate: eventDate,
          }
        : undefined,
    };
  });
}

function getInitialServerDB(): ServerDatabase {
  const initialSubmissions = getInitialRealtimeSubmissions();

  const initialProfiles: Record<string, UserProfile> = {
    student: {
      id: "9c448454-2a1a-4a57-9dea-bf1ba36f4d97",
      email: "saleemshaik2005@gmail.com",
      full_name: "Shaik Saleem",
      role: "student",
      roll_number: "160124771129",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2024-2028 (5th Semester)",
      is_lateral_entry: false,
      mentor_name: "Dr. Anireddy Srilakshmi",
      mentor_id: "dd38a4de-c509-44dd-99c6-5d98f6bb29c4",
      mentor_email: "srilakshmia_aids@cbit.ac.in",
      skills: ["Python", "TensorFlow", "React", "Next.js", "AI Document Intelligence", "SQL"],
      resume_url: "https://drive.google.com/file/d/sample-resume-saleem/view",
      github_url: "https://github.com/saleemshaik2005",
      linkedin_url: "https://linkedin.com/in/saleemshaik",
    },
    mentor: {
      id: "378feeb5-4cd4-430e-812c-c9d95fa1734d",
      email: "shobarani_aids@cbit.ac.in",
      full_name: "Dr. Shobarani Salvadi",
      role: "mentor",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      batch_year: "Assistant Professor (Faculty Mentor 1)",
      is_lateral_entry: false,
    },
    class_teacher: {
      id: "4137919d-34de-475f-914c-166da2ddcbf1",
      email: "saisreetalla_aids@cbit.ac.in",
      full_name: "Ms. Talla Sai Sree",
      role: "class_teacher",
      roll_number: "11628",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "Class Coordinator (Faculty ID: 11628)",
      is_lateral_entry: false,
    },
    hod: {
      id: "4cb6c35f-56ab-419e-8d1f-0f83c1868c10",
      email: "kradhika_aids@cbit.ac.in",
      full_name: "Dr. K. Radhika",
      role: "hod",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      batch_year: "Professor & Head, AI&DS Dept.",
      is_lateral_entry: false,
    },
    admin: {
      id: "4a004de1-7e56-4616-9371-fe673a5dff96",
      email: "cbit.spms.admin@gmail.com",
      full_name: "System Administrator (Shaik Saleem)",
      role: "admin",
      roll_number: "160124771129-ADMIN",
      department: "Academic Section",
      batch_year: "Administration",
      is_lateral_entry: false,
    },
  };

  const initialNotifications: NotificationItem[] = [
    {
      id: "notif-1",
      recipient_role: "student",
      recipient_id: "9c448454-2a1a-4a57-9dea-bf1ba36f4d97",
      type: "approval",
      title: "Certificate Approved (+20 Points)",
      message: "Dr. Anireddy Srilakshmi approved your NPTEL Deep Learning Specialization Certificate.",
      link: "/student/history",
      is_read: false,
      sender_name: "Dr. Anireddy Srilakshmi",
      created_at: getRelativeISOString(2),
    },
    {
      id: "notif-2",
      recipient_role: "mentor",
      recipient_id: "usr-mentor-001",
      type: "submission",
      title: "New Certificate In Queue",
      message: "Shaik Saleem submitted NPTEL Advanced LLMs & GenAI Specialization for review.",
      link: "/mentor",
      is_read: false,
      sender_name: "Shaik Saleem",
      created_at: getRelativeISOString(5),
    },
    {
      id: "notif-3",
      recipient_role: "all",
      type: "announcement",
      title: "Semester 5 MAR Submission Portal Active",
      message: "All B.Tech students are requested to upload activity certificates before final semester verification.",
      link: "/student/guidelines",
      is_read: true,
      sender_name: "Academic Section Admin",
      created_at: getRelativeISOString(24),
    },
  ];

  return {
    submissions: initialSubmissions,
    profiles: initialProfiles,
    categories: CBIT_24_CATEGORIES,
    settings: {
      id: 1,
      college_name: CBIT_COLLEGE_NAME,
      college_code: CBIT_COLLEGE_CODE,
      regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
      regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
      lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
      lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
      academic_year: "2025-2026",
    },
    notifications: initialNotifications,
    lastUpdated: new Date().toISOString(),
  };
}

// Ensure required directories exist
export function ensureServerDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const certDir = path.join(UPLOADS_DIR, 'certificates');
    const avatarDir = path.join(UPLOADS_DIR, 'avatars');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }
  } catch (err) {
    console.error('[Server DB] Error creating directories:', err);
  }
}

// Read database from file
export function readServerDB(): ServerDatabase {
  ensureServerDirectories();

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.submissions) && parsed.submissions.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Server DB] Error reading DB file, re-initializing:', err);
  }

  // Initialize if not present
  const initial = getInitialServerDB();
  writeServerDB(initial);
  return initial;
}

// Write database to file safely
export function writeServerDB(data: ServerDatabase): boolean {
  ensureServerDirectories();
  try {
    data.lastUpdated = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('[Server DB] Error writing DB file:', err);
    return false;
  }
}

// Save uploaded file to public/uploads
export function saveServerUploadedFile(
  buffer: Buffer,
  originalFilename: string,
  subfolder: 'certificates' | 'avatars'
): { success: boolean; url: string; filepath: string } {
  ensureServerDirectories();

  const ext = path.extname(originalFilename) || '.jpg';
  const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, '');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const safeName = `${subfolder.slice(0, 4)}_${timestamp}_${randomSuffix}${cleanExt}`;

  const targetDir = path.join(UPLOADS_DIR, subfolder);
  const targetPath = path.join(targetDir, safeName);

  try {
    fs.writeFileSync(targetPath, buffer);
    const publicUrl = `/uploads/${subfolder}/${safeName}`;
    return { success: true, url: publicUrl, filepath: targetPath };
  } catch (err) {
    console.error('[Server DB] Error writing file to disk:', err);
    return { success: false, url: '', filepath: '' };
  }
}
