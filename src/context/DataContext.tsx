import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  DatabaseState, InstitutionScoreBreakdown, InnovationProject, 
  ResearchPublication, Patent, ResearchGrant, Startup, 
  Competition, Award, InnovationEvent, IndicatorDefinition, 
  Feedback, CertificateRecord 
} from '../types';
import { dbService } from '../services/db';
import { IndicatorEngine } from '../services/indicatorEngine';
import { useAuth } from './AuthContext';

interface DataContextType {
  db: DatabaseState;
  scoreBreakdown: InstitutionScoreBreakdown;
  selectedDepartmentId: string;
  setSelectedDepartmentId: (deptId: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // CRUD actions
  addProject: (project: Omit<InnovationProject, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  addPublication: (publication: Omit<ResearchPublication, 'id' | 'createdAt' | 'version'>) => void;
  addPatent: (patent: Omit<Patent, 'id' | 'createdAt' | 'version'>) => void;
  addGrant: (grant: Omit<ResearchGrant, 'id' | 'createdAt' | 'version'>) => void;
  addStartup: (startup: Omit<Startup, 'id' | 'createdAt' | 'version'>) => void;
  addCompetition: (competition: Omit<Competition, 'id' | 'createdAt' | 'version'>) => void;
  addAward: (award: Omit<Award, 'id' | 'createdAt' | 'version'>) => void;
  addEvent: (event: Omit<InnovationEvent, 'id' | 'createdAt'>) => void;
  updateIndicator: (indicatorId: string, updates: Partial<IndicatorDefinition>) => void;
  addIndicator: (indicator: Omit<IndicatorDefinition, 'id'>) => void;
  verifyRecord: (
    collection: 'projects' | 'publications' | 'patents' | 'grants' | 'startups' | 'competitions' | 'awards' | 'events',
    recordId: string,
    verificationStatus: 'approved' | 'rejected' | 'correction_required',
    comments: string
  ) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  respondFeedback: (feedbackId: string, response: string) => void;
  issueCertificate: (cert: Omit<CertificateRecord, 'id' | 'generatedAt'>) => void;
  resetDatabase: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [db, setDb] = useState<DatabaseState>(() => dbService.getState());
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshState = () => {
    setDb({ ...dbService.getState() });
  };

  const scoreBreakdown = useMemo(() => {
    return IndicatorEngine.computeInstitutionalScore(
      db, 
      selectedDepartmentId === 'all' ? undefined : selectedDepartmentId
    );
  }, [db, selectedDepartmentId]);

  const addProject = (projectData: Omit<InnovationProject, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newProj: InnovationProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dbService.addRecord('projects', newProj, {
      recordType: 'Project',
      title: newProj.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Project "${newProj.title}" submitted successfully for verification.`);
  };

  const addPublication = (pubData: Omit<ResearchPublication, 'id' | 'createdAt' | 'version'>) => {
    const newPub: ResearchPublication = {
      ...pubData,
      id: `pub-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('publications', newPub, {
      recordType: 'Publication',
      title: newPub.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Research publication added to review queue.`);
  };

  const addPatent = (patData: Omit<Patent, 'id' | 'createdAt' | 'version'>) => {
    const newPat: Patent = {
      ...patData,
      id: `pat-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('patents', newPat, {
      recordType: 'Patent',
      title: newPat.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Patent application registered.`);
  };

  const addGrant = (grantData: Omit<ResearchGrant, 'id' | 'createdAt' | 'version'>) => {
    const newGrant: ResearchGrant = {
      ...grantData,
      id: `grt-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('grants', newGrant, {
      recordType: 'Grant',
      title: newGrant.projectTitle,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Research grant logged.`);
  };

  const addStartup = (stuData: Omit<Startup, 'id' | 'createdAt' | 'version'>) => {
    const newStu: Startup = {
      ...stuData,
      id: `stu-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('startups', newStu, {
      recordType: 'Startup',
      title: newStu.startupName,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Incubated venture "${newStu.startupName}" recorded.`);
  };

  const addCompetition = (compData: Omit<Competition, 'id' | 'createdAt' | 'version'>) => {
    const newComp: Competition = {
      ...compData,
      id: `comp-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('competitions', newComp, {
      recordType: 'Competition',
      title: newComp.eventName,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Competition milestone logged.`);
  };

  const addAward = (awardData: Omit<Award, 'id' | 'createdAt' | 'version'>) => {
    const newAward: Award = {
      ...awardData,
      id: `awd-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('awards', newAward, {
      recordType: 'Award',
      title: newAward.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Honor & Award recorded.`);
  };

  const addEvent = (eventData: Omit<InnovationEvent, 'id' | 'createdAt'>) => {
    const newEvent: InnovationEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('events', newEvent, {
      recordType: 'Department',
      title: newEvent.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    });
    refreshState();
    showToast(`Innovation event registered.`);
  };

  const updateIndicator = (indicatorId: string, updates: Partial<IndicatorDefinition>) => {
    dbService.updateRecord('indicators', indicatorId, updates, {
      recordType: 'Indicator',
      title: updates.name || 'Indicator Settings',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      reason: 'Administrator updated indicator weights or targets'
    });
    refreshState();
    showToast('Indicator parameters updated and institutional score recalculated.');
  };

  const addIndicator = (indData: Omit<IndicatorDefinition, 'id'>) => {
    const newInd: IndicatorDefinition = {
      ...indData,
      id: `ind-${Date.now()}`
    };
    dbService.addRecord('indicators', newInd);
    refreshState();
    showToast(`New indicator "${newInd.name}" added to assessment engine.`);
  };

  const verifyRecord = (
    collection: 'projects' | 'publications' | 'patents' | 'grants' | 'startups' | 'competitions' | 'awards' | 'events',
    recordId: string,
    verificationStatus: 'approved' | 'rejected' | 'correction_required',
    comments: string
  ) => {
    dbService.verifyRecord(collection, recordId, verificationStatus, currentUser.id, currentUser.name, comments);
    refreshState();
    const actionLabel = verificationStatus === 'approved' ? 'Approved' : verificationStatus === 'rejected' ? 'Rejected' : 'Marked for correction';
    showToast(`Record ${actionLabel}. Indicator scores updated.`);
  };

  const addFeedback = (fbData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFb: Feedback = {
      ...fbData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    dbService.addRecord('feedback', newFb);
    refreshState();
    showToast('Feedback submitted to institutional innovation council.');
  };

  const respondFeedback = (feedbackId: string, response: string) => {
    dbService.updateRecord('feedback', feedbackId, {
      adminResponse: response,
      respondedBy: currentUser.name,
      respondedAt: new Date().toISOString(),
      status: 'Addressed'
    });
    refreshState();
    showToast('Response recorded and stakeholder notified.');
  };

  const issueCertificate = (certData: Omit<CertificateRecord, 'id' | 'generatedAt'>) => {
    const newCert: CertificateRecord = {
      ...certData,
      id: `cert-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
    dbService.addRecord('certificates', newCert);
    refreshState();
    showToast(`Certificate #${newCert.certificateNumber} issued successfully.`);
  };

  const resetDatabase = () => {
    const fresh = dbService.resetToDefault();
    setDb({ ...fresh });
    showToast('Database reset to official Ministry of AYUSH demonstration state.');
  };

  return (
    <DataContext.Provider value={{
      db,
      scoreBreakdown,
      selectedDepartmentId,
      setSelectedDepartmentId,
      selectedYear,
      setSelectedYear,
      searchQuery,
      setSearchQuery,
      addProject,
      addPublication,
      addPatent,
      addGrant,
      addStartup,
      addCompetition,
      addAward,
      addEvent,
      updateIndicator,
      addIndicator,
      verifyRecord,
      addFeedback,
      respondFeedback,
      issueCertificate,
      resetDatabase,
      toastMessage,
      showToast
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
