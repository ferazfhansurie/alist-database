import databaseService from './databaseService.js';
import { sampleKOLData } from '../data/models.js';

class MigrationService {
  // Migrate sample data to database
  async migrateSampleData() {
    try {
      console.log('Starting migration of sample data...');
      
      // Check if database already has data
      const existingKOLs = await databaseService.getAllKOLs();
      
      if (existingKOLs.length > 0) {
        console.log('Database already contains data, skipping migration');
        return;
      }
      
      // Initialize database schema
      await databaseService.initializeDatabase();
      
      // Migrate each sample KOL
      let migratedCount = 0;
      for (const sampleKOL of sampleKOLData) {
        try {
          // Convert sample data format to database format
          const kolData = {
            name: sampleKOL.name,
            instagram: sampleKOL.instagram,
            tiktok: sampleKOL.tiktok,
            facebook: sampleKOL.facebook,
            twitter: sampleKOL.twitter,
            thread: sampleKOL.thread,
            blog: sampleKOL.blog,
            rate: sampleKOL.rate,
            tier: sampleKOL.tier,
            gender: sampleKOL.gender,
            niches: sampleKOL.niches,
            hairStyle: sampleKOL.hairStyle,
            race: sampleKOL.race,
            address: sampleKOL.address,
            contactNumber: sampleKOL.contactNumber,
            rateDetails: sampleKOL.rateDetails,
            pic: sampleKOL.pic,
            kolType: sampleKOL.kolType,
            notes: sampleKOL.notes
          };
          
          await databaseService.createKOL(kolData);
          migratedCount++;
          console.log(`Migrated KOL: ${sampleKOL.name}`);
        } catch (error) {
          console.error(`Error migrating KOL ${sampleKOL.name}:`, error);
        }
      }
      
      console.log(`Migration completed. ${migratedCount} KOLs migrated successfully.`);
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  // Clear all data (for testing purposes)
  async clearAllData() {
    try {
      console.log('Clearing all data...');
      
      const client = await databaseService.getPool().connect();
      try {
        await client.query('BEGIN');
        
        // Delete all KOL niches relationships
        await client.query('DELETE FROM kol_niches');
        
        // Delete all KOLs
        await client.query('DELETE FROM kols');
        
        // Delete all niches
        await client.query('DELETE FROM niches');
        
        await client.query('COMMIT');
        console.log('All data cleared successfully');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Get migration status
  async getMigrationStatus() {
    try {
      const kols = await databaseService.getAllKOLs();
      const niches = await databaseService.getAllNiches();
      
      return {
        hasData: kols.length > 0,
        kolCount: kols.length,
        nicheCount: niches.length,
        sampleDataCount: sampleKOLData.length
      };
    } catch (error) {
      console.error('Error getting migration status:', error);
      return {
        hasData: false,
        kolCount: 0,
        nicheCount: 0,
        sampleDataCount: sampleKOLData.length,
        error: error.message
      };
    }
  }
}

export default new MigrationService();
