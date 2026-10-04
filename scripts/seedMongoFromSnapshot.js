import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedMongo = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in process.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    console.log('Connected to database:', db.databaseName);

    const snapshotPath = path.resolve(__dirname, '../src/data/dbSnapshot.json');
    if (!fs.existsSync(snapshotPath)) {
      console.log('src/data/dbSnapshot.json has been removed as all data is stored in MongoDB Atlas.');
      await mongoose.disconnect();
      process.exit(0);
    }
    const snapshotRaw = fs.readFileSync(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(snapshotRaw);

    const COLLECTION_MAPPING = {
      users: 'users',
      classes: 'classes',
      subjects: 'subjects',
      staffs: 'staffs',
      students: 'students',
      fees: 'fees',
      attendances: 'attendances',
      examresults: 'examresults',
      assignments: 'assignments',
      timetables: 'timetables',
      notices: 'notices',
      onlineclasses: 'onlineclasses',
      leaves: 'leaves',
      librarybooks: 'librarybooks',
      hostels: 'hostels',
      transports: 'transports',
      payrolls: 'payrolls',
      inventories: 'inventories'
    };

    const transportRoutes = [
      { _id: 'tr_1', destination: "Madurai", route: "Kovilpatti → Virudhunagar → Madurai", notes: "Frequent TNSTC services" },
      { _id: 'tr_2', destination: "Tirunelveli", route: "Kovilpatti → Tirunelveli", notes: "Frequent services" },
      { _id: 'tr_3', destination: "Thoothukudi", route: "Kovilpatti → Thoothukudi", notes: "Local/intercity services" },
      { _id: 'tr_4', destination: "Tiruchendur", route: "Kovilpatti → Tiruchendur", notes: "Direct services available" },
      { _id: 'tr_5', destination: "Tenkasi", route: "Kovilpatti → Sankarankoil → Tenkasi", notes: "Route listed by Municipality" },
      { _id: 'tr_6', destination: "Sengottai", route: "Kovilpatti → Sankarankoil → Tenkasi → Sengottai", notes: "Direct/through services" },
      { _id: 'tr_7', destination: "Coimbatore", route: "Kovilpatti → Madurai → Dindigul → Coimbatore", notes: "Long-distance service" },
      { _id: 'tr_8', destination: "Chennai", route: "Kovilpatti → Chennai", notes: "Multiple long-distance services" },
      { _id: 'tr_9', destination: "Nagercoil", route: "Kovilpatti → Tirunelveli → Nagercoil", notes: "Through services" },
      { _id: 'tr_10', destination: "Kanyakumari", route: "Kovilpatti → Tirunelveli → Nagercoil → Kanyakumari", notes: "Through services" },
      { _id: 'tr_11', destination: "Bengaluru", route: "Kovilpatti → Bengaluru", notes: "Long-distance services" },
      { _id: 'tr_12', destination: "Tirupati", route: "Kovilpatti → Tirupati", notes: "Long-distance services" },
      { _id: 'tr_13', destination: "Vellore", route: "Kovilpatti → Vellore", notes: "Through service" },
      { _id: 'tr_14', destination: "Erode", route: "Kovilpatti → Erode", notes: "Through service" },
      { _id: 'tr_15', destination: "Velankanni", route: "Kovilpatti → Velankanni", notes: "Through service" },
      { _id: 'tr_16', destination: "Chidambaram", route: "Kovilpatti → Chidambaram", notes: "Through service" },
      { _id: 'tr_17', destination: "Thiruvananthapuram", route: "Kovilpatti → Nagercoil → Kerala", notes: "Through service" }
    ];

    for (const [snapKey, collName] of Object.entries(COLLECTION_MAPPING)) {
      const items = snapshot[snapKey];
      if (Array.isArray(items) && items.length > 0) {
        console.log(`Processing ${items.length} records for '${collName}'...`);
        const coll = db.collection(collName);
        for (const item of items) {
          const doc = { ...item };
          const id = doc._id || doc.id;
          delete doc._id;
          const created = doc.createdAt ? new Date(doc.createdAt) : new Date();
          delete doc.createdAt;

          let query = { _id: id };
          if (collName === 'staffs' && doc.employeeId) {
            query = { $or: [{ _id: id }, { employeeId: doc.employeeId }] };
          } else if (collName === 'students' && doc.admissionNo) {
            query = { $or: [{ _id: id }, { admissionNo: doc.admissionNo }] };
          } else if (collName === 'users' && doc.email) {
            query = { $or: [{ _id: id }, { email: doc.email }] };
          } else if (collName === 'classes' && doc.name && doc.section) {
            query = { $or: [{ _id: id }, { name: doc.name, section: doc.section }] };
          }

          await coll.updateOne(
            query,
            {
              $set: { ...doc, updatedAt: new Date() },
              $setOnInsert: { _id: id, createdAt: created }
            },
            { upsert: true }
          );
        }
        const total = await coll.countDocuments();
        console.log(`Collection '${collName}' now has ${total} documents.`);
      }
    }

    console.log(`Seeding ${transportRoutes.length} transport routes...`);
    const trColl = db.collection('transportroutes');
    for (const tr of transportRoutes) {
      const { _id, ...rest } = tr;
      await trColl.updateOne(
        { _id },
        { $set: rest, $setOnInsert: { _id } },
        { upsert: true }
      );
    }
    console.log(`Collection 'transportroutes' now has ${await trColl.countDocuments()} documents.`);

    console.log('\n=============================================');
    console.log('SUCCESS: All details are stored in MongoDB Atlas!');
    console.log('=============================================\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedMongo();
