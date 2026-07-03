import { connectDatabase } from '../config/database.js';
import { User } from '../models/User.js';
import { ImportBatch } from '../models/ImportBatch.js';

async function check() {
  try {
    await connectDatabase();
    
    const userCount = await User.countDocuments({});
    const activeCount = await User.countDocuments({ isActive: true });
    const inactiveCount = await User.countDocuments({ isActive: false });
    const activatedCount = await User.countDocuments({ isActivated: true });
    const unactivatedCount = await User.countDocuments({ isActivated: false });
    
    console.log(`--- DB STATS ---`);
    console.log(`Total Users: ${userCount}`);
    console.log(`Active (isActive:true): ${activeCount}`);
    console.log(`Inactive (isActive:false): ${inactiveCount}`);
    console.log(`Activated (isActivated:true): ${activatedCount}`);
    console.log(`Unactivated (isActivated:false): ${unactivatedCount}`);
    
    const batches = await ImportBatch.find().sort({ createdAt: -1 }).limit(5).lean();
    console.log(`--- IMPORT BATCHES ---`);
    for (const b of batches) {
      console.log(`Batch File: ${b.fileName}, Status: ${b.status}, Read: ${b.totalRows}, Success: ${b.successCount}, Failed: ${b.failedCount}`);
      if (b.errors && b.errors.length > 0) {
        console.log(`  First 3 errors:`, JSON.stringify(b.errors.slice(0, 3), null, 2));
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
