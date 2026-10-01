import { connectDatabase, disconnectDatabase } from './connect';
import { UserModel } from './models/User';
import { ProjectModel } from './models/Project';
import { PublicationModel } from './models/Publication';
import { PatentModel } from './models/Patent';
import { GrantModel } from './models/Grant';
import { StartupModel } from './models/Startup';
import { CompetitionModel } from './models/Competition';
import { AwardModel } from './models/Award';
import { EventModel } from './models/Event';
import { IndicatorModel } from './models/Indicator';
import { AuditLogModel } from './models/AuditLog';
import { FeedbackModel } from './models/Feedback';
import { CertificateModel } from './models/Certificate';

import { dbService } from '../src/services/db';

export const seedDatabase = async () => {
  try {
    console.log('--- Starting MongoDB Atlas Database Seed ---');
    await connectDatabase();

    const initialState = dbService.getState();

    // 1. Seed Users
    await UserModel.deleteMany({});
    await UserModel.insertMany(initialState.users);
    console.log(`✓ Seeded ${initialState.users.length} Users into MongoDB Atlas`);

    // 2. Seed Indicators
    await IndicatorModel.deleteMany({});
    await IndicatorModel.insertMany(initialState.indicators);
    console.log(`✓ Seeded ${initialState.indicators.length} Indicators into MongoDB Atlas`);

    // 3. Seed Projects
    await ProjectModel.deleteMany({});
    await ProjectModel.insertMany(initialState.projects);
    console.log(`✓ Seeded ${initialState.projects.length} Innovation Projects into MongoDB Atlas`);

    // 4. Seed Publications
    await PublicationModel.deleteMany({});
    await PublicationModel.insertMany(initialState.publications);
    console.log(`✓ Seeded ${initialState.publications.length} Research Publications into MongoDB Atlas`);

    // 5. Seed Patents
    await PatentModel.deleteMany({});
    await PatentModel.insertMany(initialState.patents);
    console.log(`✓ Seeded ${initialState.patents.length} Patents into MongoDB Atlas`);

    // 6. Seed Grants
    await GrantModel.deleteMany({});
    await GrantModel.insertMany(initialState.grants);
    console.log(`✓ Seeded ${initialState.grants.length} Grants into MongoDB Atlas`);

    // 7. Seed Startups
    await StartupModel.deleteMany({});
    await StartupModel.insertMany(initialState.startups);
    console.log(`✓ Seeded ${initialState.startups.length} Startups into MongoDB Atlas`);

    // 8. Seed Competitions
    await CompetitionModel.deleteMany({});
    await CompetitionModel.insertMany(initialState.competitions);
    console.log(`✓ Seeded ${initialState.competitions.length} Competitions into MongoDB Atlas`);

    // 9. Seed Awards
    await AwardModel.deleteMany({});
    await AwardModel.insertMany(initialState.awards);
    console.log(`✓ Seeded ${initialState.awards.length} Awards into MongoDB Atlas`);

    // 10. Seed Events
    await EventModel.deleteMany({});
    await EventModel.insertMany(initialState.events);
    console.log(`✓ Seeded ${initialState.events.length} Events into MongoDB Atlas`);

    // 11. Seed Audit Logs
    await AuditLogModel.deleteMany({});
    await AuditLogModel.insertMany(initialState.auditLogs);
    console.log(`✓ Seeded ${initialState.auditLogs.length} Audit Logs into MongoDB Atlas`);

    // 12. Seed Feedback
    await FeedbackModel.deleteMany({});
    await FeedbackModel.insertMany(initialState.feedback);
    console.log(`✓ Seeded ${initialState.feedback.length} Feedback entries into MongoDB Atlas`);

    // 13. Seed Certificates
    await CertificateModel.deleteMany({});
    await CertificateModel.insertMany(initialState.certificates);
    console.log(`✓ Seeded ${initialState.certificates.length} Certificates into MongoDB Atlas`);

    console.log('--- MongoDB Atlas Seeding Successfully Completed ---');
  } catch (error) {
    console.error('Error during MongoDB Atlas database seeding:', error);
  } finally {
    await disconnectDatabase();
  }
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase();
}
