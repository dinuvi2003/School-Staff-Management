import { supabaseAnon, supabaseAdmin } from "../../../config/supabase.js";


export async function signInWithPassword(email, password) {
    return await supabaseAnon.auth.signInWithPassword({ email, password });
}


export async function getUserFromAccess(userClient) {
    return await userClient.auth.getUser();
}


export async function refreshSession(refresh_token) {

    return await supabaseAnon.auth.setSession({ refresh_token });
}


export async function signOut(accessToken) {

    try {
        const client = supabaseAnon;
        client.auth.setAuth(accessToken);
        return await client.auth.signOut();
    } catch (e) {
        return { error: e, data: null };
    }
}

// Create user (invite-like) via admin
export async function adminCreateUser({ email, password, email_confirm = true }) {
    return await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm });
}

