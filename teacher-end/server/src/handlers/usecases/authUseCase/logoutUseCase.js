import { deleteRefreshToken } from '../../repositories/authRepositories/tokenRepository.js';
import { hashToken } from '../../../services/utils/crypto.js';

export async function logoutUseCase(refreshPlain) {
    if (!refreshPlain) return { data: true };
    const deleted = await deleteRefreshToken(hashToken(refreshPlain));
    if (deleted.error) {
        return { error: 'Something went wrong', status: 500 };
    }
    return { data: true };
}
