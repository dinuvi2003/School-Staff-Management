import { deleteExpiredActionTokens } from "../../handlers/repositories/authRepositories/tokenRepository"

export async function startTokenCleanupJob() {
    setInterval(async () => {
        try {
            await deleteExpiredActionTokens();
        } catch (e) {
            console.error("Error during token cleanup:", e);
        }
    }, 10 * 60 * 1000);
}