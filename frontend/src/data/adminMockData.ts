export interface VerificationRequest {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  department: string;
  facultyCode: string;
  appliedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  hash: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
}

export const initialVerifications: VerificationRequest[] = [
  {
    id: "REQ-901",
    fullName: "Dr. Kavita Sharma",
    email: "kavita.sharma@dtu.ac.in",
    institution: "Delhi Technological University",
    department: "Computer Science & Engineering",
    facultyCode: "FAC-DTU-2024-88",
    appliedDate: "12 mins ago",
    status: "Pending",
  },
  {
    id: "REQ-902",
    fullName: "Prof. Rajesh Pillai",
    email: "rpillai@bits-pilani.ac.in",
    institution: "BITS Pilani",
    department: "Electrical & Instrumentation",
    facultyCode: "BITS-EIE-419",
    appliedDate: "1 hour ago",
    status: "Pending",
  },
  {
    id: "REQ-899",
    fullName: "Dr. Nia Okafor",
    email: "nia.okafor@connect.edu",
    institution: "Global Open Academy",
    department: "Community Engagement",
    facultyCode: "GOA-7731",
    appliedDate: "Yesterday",
    status: "Approved",
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: "LOG-5401",
    timestamp: "2026-09-13 03:15:22",
    actor: "SYSTEM_ROUTER",
    action: "CERTIFICATE_HASH_MINTED",
    resource: "CC-2026-CERT-98842",
    hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    status: "SUCCESS",
  },
  {
    id: "LOG-5400",
    timestamp: "2026-09-13 03:10:04",
    actor: "aisha_m",
    action: "ASSESSMENT_SUBMITTED",
    resource: "Digital Literacy Checkpoint (Score: 100%)",
    hash: "0x3f79bb7b435b05321651daefd374cd681b499129711b34bf165dffb7940a6ee2",
    status: "SUCCESS",
  },
  {
    id: "LOG-5399",
    timestamp: "2026-09-13 02:44:11",
    actor: "192.168.1.104",
    action: "UNAUTHORIZED_ADMIN_PROBE",
    resource: "/api/v1/internal/secrets",
    hash: "0xef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    status: "BLOCKED",
  },
];