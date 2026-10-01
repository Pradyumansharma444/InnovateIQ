export type UserRole = 
  | 'super_admin'
  | 'institution_admin'
  | 'department_head'
  | 'faculty'
  | 'student'
  | 'reviewer';

export type VerificationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'correction_required'
  | 'completed'
  | 'archived';

export interface User {
  id: string;
  googleId?: string;
  name: string;
  email: string;
  profilePhoto?: string;
  role: UserRole;
  roles?: string[]; // Array of selected roles from onboarding
  institutionId: string;
  departmentId?: string;
  designation?: string;
  avatar?: string;
  rollNumber?: string;
  employeeId?: string;
  bio?: string;
  onboardingCompleted?: boolean;
  isPrivilegedAdmin?: boolean;
  isPrivilegedReviewer?: boolean;
  createdAt: string;
}

export interface Institution {
  id: string;
  institutionName: string;
  institutionCode: string;
  institutionType: 'University' | 'National Institute' | 'Autonomous Body' | 'College';
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  email: string;
  phone: string;
  logo?: string;
  establishedYear: number;
  description: string;
  supportedLanguages: string[];
  status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  headUserId?: string;
  headName?: string;
  facultyCount: number;
  studentCount: number;
  status: 'active' | 'archived';
  description?: string;
}

export interface InnovationProject {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  createdByUserRole: UserRole;
  teamMembers: string[];
  category: 'Ayurveda Formulation' | 'Biomedical Device' | 'AI in Diagnostics' | 'Herbal Pharmacology' | 'Panchakarma Tech' | 'Digital Health' | 'Other';
  technology: string;
  problemStatement: string;
  solution: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Commercialized';
  startDate: string;
  endDate?: string;
  funding: number; // in INR
  outcome: string;
  impact: string;
  documents: string[];
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchPublication {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  authors: string[];
  createdBy: string;
  createdByName: string;
  publicationType: 'Journal Article' | 'Conference Proceeding' | 'Book Chapter' | 'Monograph';
  journal: string;
  conference?: string;
  publisher: string;
  publicationDate: string;
  doi: string;
  citationCount: number;
  indexing: 'SCI' | 'Scopus' | 'UGC-CARE' | 'PubMed' | 'AYUSH Portal';
  documentUrl?: string;
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface Patent {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  inventors: string[];
  createdBy: string;
  createdByName: string;
  patentNumber?: string;
  applicationNumber: string;
  filingDate: string;
  grantDate?: string;
  status: 'Filed' | 'Published' | 'Under Examination' | 'Granted' | 'Commercialized';
  category: 'Ayurvedic Formulation' | 'Extraction Process' | 'Diagnostic Device' | 'Therapeutic Method';
  documentUrl?: string;
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface ResearchGrant {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  projectTitle: string;
  principalInvestigator: string;
  principalInvestigatorId: string;
  fundingAgency: 'Ministry of AYUSH' | 'ICMR' | 'DST' | 'DBT' | 'CCRAS' | 'CSIR' | 'International Agency';
  amount: number; // in INR Lakhs
  grantDate: string;
  duration: string; // e.g. "36 Months"
  status: 'Sanctioned' | 'Ongoing' | 'Completed' | 'Audited';
  projectOutcome: string;
  documentUrl?: string;
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface Startup {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  startupName: string;
  founders: string[];
  createdBy: string;
  createdByName: string;
  studentOrFaculty: 'Student' | 'Faculty' | 'Joint';
  incubator: string;
  industry: 'AYUSH Wellness' | 'Herbal Nutraceuticals' | 'AyurTech Telemedicine' | 'Herbal Cosmeceuticals' | 'Phyto-pharmaceuticals';
  funding: number; // Seed grant in INR Lakhs
  launchDate: string;
  status: 'Ideation' | 'Incubated' | 'Seed Funded' | 'Market Ready' | 'Revenue Generating';
  website?: string;
  achievement: string;
  documents: string[];
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface Competition {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  eventName: string;
  eventType: 'Hackathon' | 'Ideathon' | 'Innovation Conclave' | 'Business Pitch' | 'Robotics/Tech Expo';
  participantType: 'Student' | 'Faculty' | 'Mixed Team';
  participants: string[];
  createdBy: string;
  createdByName: string;
  date: string;
  organizer: string;
  position: '1st Place (Winner)' | '2nd Place (Runner-up)' | '3rd Place' | 'Special Recognition' | 'Finalist';
  award: string;
  certificateUrl?: string;
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface Award {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  recipient: string;
  recipientId: string;
  recipientType: 'Student' | 'Faculty' | 'Department' | 'Institution';
  organization: string;
  date: string;
  category: 'National Innovation Award' | 'AYUSH Young Scientist' | 'Patent Excellence' | 'Societal Impact' | 'Global Wellness Leadership';
  description: string;
  awardLevel: 'International' | 'National' | 'State' | 'Institutional';
  certificateUrl?: string;
  verificationStatus: VerificationStatus;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  createdAt: string;
}

export interface InnovationEvent {
  id: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  eventType: 'Workshop' | 'Seminar' | 'Hackathon' | 'Innovation Challenge' | 'Ideathon' | 'Conference' | 'Training Program' | 'Entrepreneurship Bootcamp';
  organizer: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  studentCount: number;
  facultyCount: number;
  outcome: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface IndicatorDefinition {
  id: string;
  code: string;
  name: string;
  category: 'Research' | 'IPR' | 'Grants' | 'Entrepreneurship' | 'Competitions' | 'Institutional Impact';
  weight: number; // percentage (summing to 100%)
  target: number;
  calculationMethod: string;
  reportingPeriod: 'Annual' | 'Bi-Annual' | 'Quarterly';
  assignedTo: 'Institution' | 'Department';
  isActive: boolean;
  description: string;
}

export interface IndicatorScoreResult {
  indicatorId: string;
  code: string;
  name: string;
  category: string;
  weight: number;
  target: number;
  actual: number;
  achievementPercentage: number;
  weightedScore: number;
  gap: number;
  status: 'Exceeded' | 'On Track' | 'Attention Required' | 'Lagging';
}

export interface InstitutionScoreBreakdown {
  overallScore: number; // 0 to 100
  totalIndicators: number;
  totalApprovedRecords: number;
  results: IndicatorScoreResult[];
  lastCalculatedAt: string;
}

export interface AuditLog {
  id: string;
  recordId: string;
  recordType: 'Project' | 'Publication' | 'Patent' | 'Grant' | 'Startup' | 'Competition' | 'Award' | 'Indicator' | 'Department';
  recordTitle: string;
  version: number;
  action: 'Created' | 'Updated' | 'Submitted' | 'Verified' | 'Approved' | 'Rejected' | 'Correction Requested';
  changedBy: string;
  changedByName: string;
  changedByRole: UserRole;
  changedAt: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

export interface Feedback {
  id: string;
  institutionId: string;
  type: 'Innovation Portal Feedback' | 'Project Feedback' | 'Department Feedback' | 'Event Feedback' | 'Suggestion' | 'Issue';
  message: string;
  submittedBy: string;
  submittedByName: string;
  submittedByRole: UserRole;
  rating: number; // 1 to 5
  status: 'Open' | 'Under Review' | 'Addressed' | 'Closed';
  adminResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail?: string;
  recipientRole: 'Student' | 'Faculty' | 'Department Head';
  achievementTitle: string;
  category: string;
  issueDate: string;
  institutionName: string;
  authorizedSignatory: string;
  signatoryTitle: string;
  qrCodeMockUrl: string;
  status: 'Issued' | 'Revoked';
  generatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface DatabaseState {
  institutions: Institution[];
  departments: Department[];
  users: User[];
  projects: InnovationProject[];
  publications: ResearchPublication[];
  patents: Patent[];
  grants: ResearchGrant[];
  startups: Startup[];
  competitions: Competition[];
  awards: Award[];
  events: InnovationEvent[];
  indicators: IndicatorDefinition[];
  auditLogs: AuditLog[];
  feedback: Feedback[];
  certificates: CertificateRecord[];
  notifications: NotificationItem[];
}

