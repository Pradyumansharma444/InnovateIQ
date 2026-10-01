import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './connect';
import { ProjectModel } from './models/Project';
import { PublicationModel } from './models/Publication';
import { PatentModel } from './models/Patent';
import { GrantModel } from './models/Grant';
import { StartupModel } from './models/Startup';
import { CompetitionModel } from './models/Competition';
import { AwardModel } from './models/Award';
import { EventModel } from './models/Event';
import { IndicatorModel } from './models/Indicator';
import { UserModel } from './models/User';
import { AuditLogModel } from './models/AuditLog';
import { FeedbackModel } from './models/Feedback';
import { CertificateModel } from './models/Certificate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MongoDB Atlas', timestamp: new Date().toISOString() });
});

// GET complete database state from MongoDB Atlas
app.get('/api/state', async (req, res) => {
  try {
    await connectDatabase();
    const [
      users, projects, publications, patents, grants, 
      startups, competitions, awards, events, indicators, 
      auditLogs, feedback, certificates
    ] = await Promise.all([
      UserModel.find({}),
      ProjectModel.find({}),
      PublicationModel.find({}),
      PatentModel.find({}),
      GrantModel.find({}),
      StartupModel.find({}),
      CompetitionModel.find({}),
      AwardModel.find({}),
      EventModel.find({}),
      IndicatorModel.find({}),
      AuditLogModel.find({}),
      FeedbackModel.find({}),
      CertificateModel.find({})
    ]);

    res.json({
      users,
      projects,
      publications,
      patents,
      grants,
      startups,
      competitions,
      awards,
      events,
      indicators,
      auditLogs,
      feedback,
      certificates
    });
  } catch (error) {
    console.error('Error fetching database state from MongoDB Atlas:', error);
    res.status(500).json({ error: 'Failed to fetch database state' });
  }
});

// Add new record endpoint
app.post('/api/records/:collection', async (req, res) => {
  const { collection } = req.params;
  const data = req.body;

  try {
    await connectDatabase();
    let model: any;
    switch (collection) {
      case 'projects': model = ProjectModel; break;
      case 'publications': model = PublicationModel; break;
      case 'patents': model = PatentModel; break;
      case 'grants': model = GrantModel; break;
      case 'startups': model = StartupModel; break;
      case 'competitions': model = CompetitionModel; break;
      case 'awards': model = AwardModel; break;
      case 'events': model = EventModel; break;
      case 'indicators': model = IndicatorModel; break;
      case 'feedback': model = FeedbackModel; break;
      case 'certificates': model = CertificateModel; break;
      default: return res.status(400).json({ error: `Unknown collection ${collection}` });
    }

    const created = await model.create(data);
    res.status(201).json(created);
  } catch (error) {
    console.error(`Error adding record to MongoDB Atlas (${collection}):`, error);
    res.status(500).json({ error: 'Failed to insert record into MongoDB Atlas' });
  }
});

// Update record endpoint
app.patch('/api/records/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;
  const updates = req.body;

  try {
    await connectDatabase();
    let model: any;
    switch (collection) {
      case 'projects': model = ProjectModel; break;
      case 'publications': model = PublicationModel; break;
      case 'patents': model = PatentModel; break;
      case 'grants': model = GrantModel; break;
      case 'startups': model = StartupModel; break;
      case 'competitions': model = CompetitionModel; break;
      case 'awards': model = AwardModel; break;
      case 'events': model = EventModel; break;
      case 'indicators': model = IndicatorModel; break;
      case 'feedback': model = FeedbackModel; break;
      default: return res.status(400).json({ error: `Unknown collection ${collection}` });
    }

    const updated = await model.findOneAndUpdate({ id }, updates, { new: true });
    res.json(updated);
  } catch (error) {
    console.error(`Error updating record in MongoDB Atlas (${collection}/${id}):`, error);
    res.status(500).json({ error: 'Failed to update record in MongoDB Atlas' });
  }
});

export const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 MongoDB Express Server running on http://localhost:${PORT}`);
  });
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('server.ts')) {
  startServer();
}

export default app;
