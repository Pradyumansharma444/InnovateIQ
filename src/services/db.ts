import { 
  User, Institution, Department, InnovationProject, ResearchPublication, 
  Patent, ResearchGrant, Startup, Competition, Award, InnovationEvent, 
  IndicatorDefinition, AuditLog, Feedback, CertificateRecord, NotificationItem
} from '../types';

const STORAGE_KEY = 'innovateiq_portal_db_v8';

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

const initialInstitutions: Institution[] = [
  {
    id: 'inst-1',
    institutionName: 'All India Institute of Ayurveda (AIIA)',
    institutionCode: 'AIIA-ND-01',
    institutionType: 'National Institute',
    address: 'Gautampuri, Sarita Vihar, Mathura Road',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    website: 'https://aiia.gov.in',
    email: 'director@aiia.gov.in',
    phone: '+91-11-26950401',
    establishedYear: 2015,
    description: 'Apex institute for Ayurveda under the Ministry of AYUSH, Government of India, driving scientific validation and high-impact translational research.',
    supportedLanguages: ['en', 'hi'],
    status: 'active'
  },
  {
    id: 'inst-2',
    institutionName: 'National Institute of Ayurveda (NIA)',
    institutionCode: 'NIA-JP-02',
    institutionType: 'National Institute',
    address: 'Jorawar Singh Gate, Amer Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    website: 'https://nia.nic.in',
    email: 'admin@nia.nic.in',
    phone: '+91-141-2635816',
    establishedYear: 1976,
    description: 'Deemed to be University under De-novo category, pioneering postgraduate education and clinical herbal drug discovery.',
    supportedLanguages: ['en', 'hi'],
    status: 'active'
  }
];

const initialDepartments: Department[] = [
  {
    id: 'dept-1',
    institutionId: 'inst-1',
    name: 'Rasashastra & Bhaishajya Kalpana',
    code: 'RBK',
    headName: 'Prof. Anand Chaudhary',
    facultyCount: 14,
    studentCount: 52,
    status: 'active',
    description: 'Ayurvedic pharmaceutical sciences, nano-herbal drug formulations and standardization.'
  },
  {
    id: 'dept-2',
    institutionId: 'inst-1',
    name: 'Dravyaguna Vijnana',
    code: 'DGV',
    headName: 'Prof. Meenakshi Sharma',
    facultyCount: 12,
    studentCount: 46,
    status: 'active',
    description: 'Herbal pharmacognosy, medicinal plant biology and phytochemistry research.'
  },
  {
    id: 'dept-3',
    institutionId: 'inst-1',
    name: 'AyurTech & Digital Health Informatics',
    code: 'ADHI',
    headName: 'Dr. Vivek Sengupta',
    facultyCount: 8,
    studentCount: 38,
    status: 'active',
    description: 'AI diagnostics, digital pulse sensors, IoT-enabled therapy devices and genomic integrative medicine.'
  },
  {
    id: 'dept-4',
    institutionId: 'inst-1',
    name: 'Panchakarma & Clinical Research',
    code: 'PKR',
    headName: 'Dr. Santosh Patil',
    facultyCount: 16,
    studentCount: 65,
    status: 'active',
    description: 'Detoxification therapy automation, clinical bio-markers and therapeutic standardization.'
  },
  {
    id: 'dept-5',
    institutionId: 'inst-1',
    name: 'Kaumarbhritya (Pediatrics) & Herbology',
    code: 'KMB',
    headName: 'Dr. Sujata Kadam',
    facultyCount: 10,
    studentCount: 42,
    status: 'active',
    description: 'Child wellness formulations, herbal immunization boosters and pediatric clinical innovation.'
  }
];

const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Prof. Anand Chaudhary',
    email: 'anand.chaudhary@aiia.gov.in',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anand',
    role: 'faculty',
    roles: ['faculty'],
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    designation: 'Professor & HOD',
    onboardingCompleted: true,
    createdAt: new Date().toISOString()
  }
];

const initialProjects: InnovationProject[] = [
  {
    id: 'proj-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    title: 'AI-Powered Multispectral Pulse Diagnosis System (NadiVeda-AI)',
    description: 'IoT sensor array with deep neural networks for non-invasive radial artery pulse waveform classification based on classical Ayurvedic principles.',
    createdBy: 'user-1',
    createdByName: 'Prof. Anand Chaudhary',
    createdByUserRole: 'faculty',
    teamMembers: ['Prof. Anand Chaudhary', 'Dr. Santosh Patil', 'Priya Sharma'],
    category: 'AI in Diagnostics',
    technology: 'TensorFlow Edge, Photoplethysmography (PPG), Embedded Microcontrollers',
    problemStatement: 'Lack of objective standardized measurement tools in classical Nadi Pariksha diagnosis.',
    solution: 'Hardware sensor cuff coupled with a mobile neural net predicting bio-tridosha states with 94.2% precision.',
    status: 'Completed',
    startDate: '2024-01-15',
    endDate: '2025-02-28',
    funding: 4500000,
    outcome: 'Clinical trial conducted on 1,200 subjects; 2 patents filed and technology licensed.',
    impact: 'Reduced diagnostic latency by 65% across 14 AYUSH wellness centers.',
    documents: [],
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'proj-2',
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    departmentName: 'Rasashastra & Bhaishajya Kalpana',
    title: 'Standardized Phytosomal Nano-Carrier for Ashwagandha Extraction',
    description: 'Liposomal formulation improving bio-availability of withanolides for neuro-degenerative disease intervention.',
    createdBy: 'user-2',
    createdByName: 'Dr. Meenakshi Sharma',
    createdByUserRole: 'faculty',
    teamMembers: ['Dr. Meenakshi Sharma', 'Rahul Verma'],
    category: 'Ayurveda Formulation',
    technology: 'Nanotechnology, High-Pressure Homogenization, HPLC',
    problemStatement: 'Low oral bioavailability of bioactive withanolide glycosides.',
    solution: 'Encapsulation in phosphatidylcholine nano-vesicles yielding 4.2x enhanced mucosal penetration.',
    status: 'Commercialized',
    startDate: '2023-06-10',
    endDate: '2024-11-20',
    funding: 6800000,
    outcome: 'Formulation licensed to Dabur Research Foundation.',
    impact: 'Transferred technology generating ₹12 Lakhs annual royalty for the institute.',
    documents: [],
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialPublications: ResearchPublication[] = [
  {
    id: 'pub-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    title: 'Deep Convolutional Networks for Radial Artery Pulse Pattern Classification in Integrative Cardiology',
    authors: ['Prof. Anand Chaudhary', 'Dr. Vivek Sengupta', 'Priya Sharma'],
    createdBy: 'user-1',
    createdByName: 'Prof. Anand Chaudhary',
    publicationType: 'Journal Article',
    journal: 'IEEE Transactions on Biomedical Engineering',
    publisher: 'IEEE',
    publicationDate: '2024-10-14',
    doi: '10.1109/TBME.2024.3412901',
    citationCount: 42,
    indexing: 'SCI',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pub-2',
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    departmentName: 'Rasashastra & Bhaishajya Kalpana',
    title: 'Green Synthesis of Bhasma Nanoparticles and Biological Safety Profile: A 3-Year In Vivo Study',
    authors: ['Dr. Meenakshi Sharma', 'Prof. Anand Chaudhary'],
    createdBy: 'user-2',
    createdByName: 'Dr. Meenakshi Sharma',
    publicationType: 'Journal Article',
    journal: 'Journal of Ethnopharmacology (Elsevier)',
    publisher: 'Elsevier',
    publicationDate: '2024-05-18',
    doi: '10.1016/j.jep.2024.118002',
    citationCount: 68,
    indexing: 'Scopus',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialPatents: Patent[] = [
  {
    id: 'pat-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    title: 'Multimodal Sensor Array for Digital Radial Pulse Waveform Analytics and Bio-Spectral Mapping',
    inventors: ['Prof. Anand Chaudhary', 'Dr. Vivek Sengupta'],
    createdBy: 'user-1',
    createdByName: 'Prof. Anand Chaudhary',
    patentNumber: 'IN202411098412',
    applicationNumber: '202411098412',
    filingDate: '2024-02-10',
    grantDate: '2025-01-15',
    status: 'Granted',
    category: 'Diagnostic Device',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pat-2',
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    departmentName: 'Rasashastra & Bhaishajya Kalpana',
    title: 'Composition and Supercritical Extraction Method for Bio-Active Polyherbal Hepatoprotective Formulations',
    inventors: ['Dr. Meenakshi Sharma', 'Rahul Verma'],
    createdBy: 'user-2',
    createdByName: 'Dr. Meenakshi Sharma',
    applicationNumber: '202411045129',
    filingDate: '2024-07-22',
    status: 'Published',
    category: 'Ayurvedic Formulation',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialGrants: ResearchGrant[] = [
  {
    id: 'grt-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    projectTitle: 'National Mission on Integrative Digital Health Infrastructure & Clinical Evidence Repository',
    principalInvestigator: 'Prof. Anand Chaudhary',
    principalInvestigatorId: 'user-1',
    fundingAgency: 'Ministry of AYUSH',
    amount: 185.0, // 185 Lakhs
    grantDate: '2024-03-01',
    duration: '36 Months',
    status: 'Ongoing',
    projectOutcome: 'Deploying digital health diagnostic kiosks across 25 rural healthcare centers.',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialStartups: Startup[] = [
  {
    id: 'stu-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    startupName: 'NadiVeda Healthtech Solutions Pvt Ltd',
    founders: ['Priya Sharma', 'Prof. Anand Chaudhary'],
    createdBy: 'user-1',
    createdByName: 'Prof. Anand Chaudhary',
    studentOrFaculty: 'Joint',
    incubator: 'AIIA Incubation & Innovation Center',
    industry: 'AyurTech Telemedicine',
    funding: 25.0, // Seed grant 25 Lakhs
    launchDate: '2024-08-15',
    status: 'Revenue Generating',
    website: 'https://nadiveda.ai',
    achievement: 'Secured ₹50 Lakhs BIRAC SPARSH grant & incubated at AIIA.',
    documents: [],
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialCompetitions: Competition[] = [
  {
    id: 'comp-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    eventName: 'Smart India Hackathon (SIH) Hardware Edition',
    eventType: 'Hackathon',
    participantType: 'Student',
    participants: ['Priya Sharma', 'Rohan Verma', 'Ananya Gupta'],
    createdBy: 'user-1',
    createdByName: 'Prof. Anand Chaudhary',
    date: '2024-12-19',
    organizer: 'Ministry of Education & AICTE',
    position: '1st Place (Winner)',
    award: 'National Winner Trophy + ₹1,00,000 Cash Prize',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialAwards: Award[] = [
  {
    id: 'awd-1',
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    departmentName: 'Rasashastra & Bhaishajya Kalpana',
    title: 'National AYUSH Young Scientist Innovation Award',
    recipient: 'Dr. Meenakshi Sharma',
    recipientId: 'user-2',
    recipientType: 'Faculty',
    organization: 'Ministry of AYUSH, Government of India',
    date: '2024-11-10',
    category: 'AYUSH Young Scientist',
    description: 'Conferred for outstanding translational research in phytosomal drug delivery.',
    awardLevel: 'National',
    verificationStatus: 'approved',
    version: 1,
    createdAt: new Date().toISOString()
  }
];

const initialEvents: InnovationEvent[] = [
  {
    id: 'ev-1',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'AyurTech & Digital Health Informatics',
    title: 'National Ideathon on AI in Traditional Integrative Medicine',
    eventType: 'Ideathon',
    organizer: 'AIIA Innovation Cell',
    startDate: '2024-09-05',
    endDate: '2024-09-07',
    participantsCount: 320,
    studentCount: 260,
    facultyCount: 60,
    outcome: 'Shortlisted 12 high-impact student prototypes for incubator onboarding.',
    status: 'Completed',
    verificationStatus: 'approved',
    createdAt: new Date().toISOString()
  }
];

const initialIndicators: IndicatorDefinition[] = [
  {
    id: 'ind-1',
    code: 'IND_PUB_01',
    name: 'Peer-Reviewed Research Publications (SCI/Scopus)',
    category: 'Research',
    weight: 15,
    target: 50,
    calculationMethod: 'Count of verified SCI/Scopus journal publications',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Measures high-impact academic output and peer-reviewed AYUSH scientific validation.'
  },
  {
    id: 'ind-2',
    code: 'IND_PAT_01',
    name: 'Patents Filed & Published',
    category: 'IPR',
    weight: 15,
    target: 20,
    calculationMethod: 'Count of official Indian or international patent applications filed',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Evaluates institutional intellect property generation across formulations, tools, and processes.'
  },
  {
    id: 'ind-3',
    code: 'IND_PAT_02',
    name: 'Patents Granted & Commercialized',
    category: 'IPR',
    weight: 10,
    target: 5,
    calculationMethod: 'Count of officially granted patents and commercial licensing agreements',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Tracks realized intellectual property rights and technological translations.'
  },
  {
    id: 'ind-4',
    code: 'IND_GRT_01',
    name: 'Extramural Research Grants Sanctioned (₹ Lakhs)',
    category: 'Grants',
    weight: 15,
    target: 250, // 250 Lakhs
    calculationMethod: 'Total sanctioned funding amount in ₹ Lakhs from government or industry agencies',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Reflects institutional capability in attracting prestigious national research funds.'
  },
  {
    id: 'ind-5',
    code: 'IND_STU_01',
    name: 'Startups & Spin-offs Incubated',
    category: 'Entrepreneurship',
    weight: 15,
    target: 10,
    calculationMethod: 'Number of student or faculty-founded ventures enrolled in institutional incubator',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Fosters student entrepreneurship and commercialization in AYUSH wellness and tech.'
  },
  {
    id: 'ind-6',
    code: 'IND_PRJ_01',
    name: 'Completed Interdisciplinary Innovation Projects',
    category: 'Institutional Impact',
    weight: 10,
    target: 25,
    calculationMethod: 'Count of approved multidisciplinary development projects meeting milestones',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Assesses tangible prototypes, clinical validations, and hardware/software devices developed.'
  },
  {
    id: 'ind-7',
    code: 'IND_CMP_01',
    name: 'National/International Competitions & Hackathons Won',
    category: 'Competitions',
    weight: 10,
    target: 8,
    calculationMethod: 'Count of 1st, 2nd, or finalist podium placements at recognized innovation challenges',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Encourages competitive benchmarking and external peer evaluation.'
  },
  {
    id: 'ind-8',
    code: 'IND_EVT_01',
    name: 'Innovation Events, Hackathons & Bootcamps Conducted',
    category: 'Institutional Impact',
    weight: 10,
    target: 12,
    calculationMethod: 'Total institutional ideathons, workshops, and entrepreneurship conclaves organized',
    reportingPeriod: 'Annual',
    assignedTo: 'Institution',
    isActive: true,
    description: 'Measures institutional ecosystem vibrancy, student engagement, and capacity building.'
  }
];

const initialAuditLogs: AuditLog[] = [];

const initialFeedback: Feedback[] = [];

const initialCertificates: CertificateRecord[] = [];

const initialNotifications: NotificationItem[] = [];

export class DatabaseService {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('Failed to load portal DB from storage, initializing seed data', e);
    }

    const defaultState: DatabaseState = {
      institutions: initialInstitutions,
      departments: initialDepartments,
      users: initialUsers,
      projects: initialProjects,
      publications: initialPublications,
      patents: initialPatents,
      grants: initialGrants,
      startups: initialStartups,
      competitions: initialCompetitions,
      awards: initialAwards,
      events: initialEvents,
      indicators: initialIndicators,
      auditLogs: initialAuditLogs,
      feedback: initialFeedback,
      certificates: initialCertificates,
      notifications: initialNotifications
    };

    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: DatabaseState): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.error('Failed to save portal state to storage', e);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetToDefault(): DatabaseState {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    return this.state;
  }

  private syncApi(endpoint: string, method: string, body?: any) {
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      fetch(`http://localhost:5000/api${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      }).catch(() => {
        // Silently fallback if server is offline or in client-only mode
      });
    }
  }

  // Generic document inserter with audit logging
  public addRecord<K extends keyof DatabaseState>(
    collection: K,
    record: any,
    auditMeta?: { recordType: AuditLog['recordType']; title: string; userId: string; userName: string; userRole: any }
  ): void {
    (this.state[collection] as any[]).unshift(record);

    if (auditMeta) {
      const log: AuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        recordId: record.id,
        recordType: auditMeta.recordType,
        recordTitle: auditMeta.title,
        version: record.version || 1,
        action: 'Created',
        changedBy: auditMeta.userId,
        changedByName: auditMeta.userName,
        changedByRole: auditMeta.userRole,
        changedAt: new Date().toISOString(),
        newValue: `Created new record: "${auditMeta.title}"`
      };
      this.state.auditLogs.unshift(log);
    }

    this.saveState(this.state);
    this.syncApi(`/records/${String(collection)}`, 'POST', record);
  }

  // Generic document updater with audit trail
  public updateRecord<K extends keyof DatabaseState>(
    collection: K,
    recordId: string,
    updates: Partial<any>,
    auditMeta?: { recordType: AuditLog['recordType']; title: string; userId: string; userName: string; userRole: any; reason?: string }
  ): void {
    const list = this.state[collection] as any[];
    const idx = list.findIndex(item => item.id === recordId);
    if (idx !== -1) {
      const oldItem = { ...list[idx] };
      const newVersion = (oldItem.version || 1) + 1;
      const updatedItem = {
        ...oldItem,
        ...updates,
        version: newVersion,
        updatedAt: new Date().toISOString()
      };
      list[idx] = updatedItem;

      if (auditMeta) {
        const log: AuditLog = {
          id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          recordId: recordId,
          recordType: auditMeta.recordType,
          recordTitle: auditMeta.title || updatedItem.title || updatedItem.name || 'Record',
          version: newVersion,
          action: 'Updated',
          changedBy: auditMeta.userId,
          changedByName: auditMeta.userName,
          changedByRole: auditMeta.userRole,
          changedAt: new Date().toISOString(),
          oldValue: JSON.stringify(updates),
          newValue: `Updated ${Object.keys(updates).join(', ')}`,
          reason: auditMeta.reason || 'User updated record fields'
        };
        this.state.auditLogs.unshift(log);
      }

      this.saveState(this.state);
      this.syncApi(`/records/${String(collection)}/${recordId}`, 'PATCH', updates);
    }
  }

  // Verification workflow transition
  public verifyRecord(
    collection: 'projects' | 'publications' | 'patents' | 'grants' | 'startups' | 'competitions' | 'awards' | 'events',
    recordId: string,
    verificationStatus: 'approved' | 'rejected' | 'correction_required',
    reviewerId: string,
    reviewerName: string,
    comments: string
  ): void {
    const list = this.state[collection] as any[];
    const idx = list.findIndex(item => item.id === recordId);
    if (idx !== -1) {
      const item = list[idx];
      const prevStatus = item.verificationStatus;
      item.verificationStatus = verificationStatus;
      item.reviewedBy = reviewerName;
      item.reviewedAt = new Date().toISOString();
      item.reviewComments = comments;
      item.version = (item.version || 1) + 1;

      const action = verificationStatus === 'approved' ? 'Approved' : verificationStatus === 'rejected' ? 'Rejected' : 'Correction Requested';
      const typeMap: Record<string, AuditLog['recordType']> = {
        projects: 'Project',
        publications: 'Publication',
        patents: 'Patent',
        grants: 'Grant',
        startups: 'Startup',
        competitions: 'Competition',
        awards: 'Award',
        events: 'Department'
      };

      const log: AuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        recordId: recordId,
        recordType: typeMap[collection] || 'Project',
        recordTitle: item.title || item.startupName || item.projectName || item.eventName || 'Record',
        version: item.version,
        action: action,
        changedBy: reviewerId,
        changedByName: reviewerName,
        changedByRole: 'reviewer',
        changedAt: new Date().toISOString(),
        oldValue: `Status: ${prevStatus}`,
        newValue: `Status: ${verificationStatus}`,
        reason: comments
      };

      this.state.auditLogs.unshift(log);

      // notify author
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `Record ${action}`,
        message: `Your ${typeMap[collection]} "${item.title || item.startupName || item.eventName}" was ${verificationStatus}. ${comments ? `Review note: ${comments}` : ''}`,
        type: verificationStatus === 'approved' ? 'success' : verificationStatus === 'rejected' ? 'alert' : 'warning',
        timestamp: 'Just now',
        read: false
      });

      this.saveState(this.state);
    }
  }

  public deleteRecord<K extends keyof DatabaseState>(collection: K, recordId: string): void {
    const list = this.state[collection] as any[];
    this.state[collection] = list.filter(item => item.id !== recordId) as any;
    this.saveState(this.state);
  }
}

export const dbService = new DatabaseService();
