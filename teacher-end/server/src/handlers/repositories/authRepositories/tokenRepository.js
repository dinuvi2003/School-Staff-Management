import { db } from "../../../config/supabase.js";
import { addDays, addHours } from "../../../services/utils/time.js";

export async function storeRefreshToken(user_id, token_hash, ttlDays) {
    const expires_at = addDays(new Date(), ttlDays);
    const { data, error } = await db
        .from('refresh_tokens')
        .insert({ user_id, token_hash, expires_at })
        .select('*')
        .single();

    if (error) {
        return { error, data: null };
    }
    return { data, error: null };
}

export async function findRefreshToken(token_hash) {
    const { data, error } = await db
        .from('refresh_tokens')
        .select('*')
        .eq('token_hash', token_hash)
        .single();

    if (error) {
        return { error, data: null };
    }
    return { data, error: null };
}

export async function deleteRefreshToken(token_hash) {
    const { data, error } = await db
        .from('refresh_tokens')
        .delete()
        .eq('token_hash', token_hash);

    if (error) {
        return { error, data: null };
    }
    return { data, error: null };
}

export async function deleteAllRefreshTokensForUser(user_id) {
    const { data, error } = await db
        .from('refresh_tokens')
        .delete()
        .eq('user_id', user_id);

    if (error) {
        return { error, data: null };
    }
    return { data, error: null };
}

export async function createInviteToken(user_id, token_hash, ttlHours) {
    const expires_at = addHours(new Date(), ttlHours);
    return await db.from('action_token')
        .insert({ user_id, purpose: 'invite', token_hash, expires_at })
        .select('*')
        .single();
}


export async function useActionToken(purpose, token_hash) {
    const { data, error } = await db
        .from('action_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('purpose', purpose)
        .eq('token_hash', token_hash)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .select('*')
        .single();

    if (error) {
        return { error, data: null };
    }
    return { data, error: null };
}

export async function deleteInviteTokensForUser(user_id) {
    return await db.from('action_token')
        .delete()
        .eq('user_id', user_id)
        .eq('purpose', 'invite');
}

export async function deleteExpiredActionTokens() {
    return await db.from('action_token')
        .delete()
        .lt('expires_at', new Date().toISOString());
}

export async function consumeInviteToken(token_hash) {
    const { data, error } = await db
        .from('action_token')
        .update({ used_at: new Date().toISOString() })
        .eq('purpose', 'invite')
        .eq('token_hash', token_hash)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .select('*')
        .single();
    return { data, error };
}