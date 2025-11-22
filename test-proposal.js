import proposalService from './services/proposalService.js';
import fs from 'fs/promises';

async function test() {
    try {
        console.log('Starting proposal generation test...');

        const mockKols = [
            {
                id: 1,
                name: 'Test KOL 1',
                instagram: 'https://www.instagram.com/instagram/', // Use a public profile
                rate: 1000,
                niches: ['Fashion', 'Beauty'],
                rateDetails: '1 Post, 1 Story'
            },
            {
                id: 2,
                name: 'Test KOL 2',
                tiktok: 'https://www.tiktok.com/@tiktok', // Use a public profile
                rate: 2000,
                niches: ['Tech'],
                rateDetails: '1 Video'
            }
        ];

        console.log('Generating proposal...');
        const buffer = await proposalService.generateProposal('Test Company', mockKols);

        await fs.writeFile('test-proposal.pdf', buffer);
        console.log('Success! PDF saved to test-proposal.pdf');

        await proposalService.close();
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        await proposalService.close();
        process.exit(1);
    }
}

test();
