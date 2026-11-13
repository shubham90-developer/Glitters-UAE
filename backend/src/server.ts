import mongoose from 'mongoose';
import app from './app'; 
import config from './app/config';
// import { startVideoExpiryScheduler } from './app/schedulers/videoExpiryScheduler';

async function main(){
    try{
        await mongoose.connect(config.database_url as string);

        app.listen(config.port, ()=>{
            console.log(`server is running on ports ${config.port}`)
            
            // Start video expiry scheduler (runs every hour)
            // startVideoExpiryScheduler(60 * 60 * 1000);
        })

    }catch(err){
        console.log(err)
    }
}

main();