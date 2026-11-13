import dotenv from 'dotenv';
import path from 'path';

// Configure dotenv with quiet option to suppress all logs
dotenv.config({
    path: path.join(process.cwd(), '.env'),
    quiet: true // Suppress all dotenv logs
});

export default {
    port:process.env.PORT,
    database_url:process.env.DATABASE_URL
}