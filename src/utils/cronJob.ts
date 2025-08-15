import * as cron from 'node-cron';
import axios from 'axios';
export function initializeCronJob() {
    const targetUrl = process.env.CRON_TARGET_URL || "https://socializebackend.onrender.com";

    console.log('Starting cron job - will make GET request every 10 minutes to:', targetUrl);

    // Schedule cron job to run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        try {
            const resp = await axios.get(targetUrl);
            console.log(`[${new Date().toISOString()}] Cron job successful:`, resp.data);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Cron job failed with unexpected error:`, error);
        }
    });

    console.log('Cron job initialized successfully!');
}