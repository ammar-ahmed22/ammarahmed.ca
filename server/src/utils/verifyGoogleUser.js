import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import { OAuth2Client } from "google-auth-library";

const verifyGoogleUser = async ( idToken ) => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
    
        const userID = payload.sub;
    
        return {
            userID
        };

    } catch (error) {

        return {
            error
        }

    }

}

export default verifyGoogleUser


