import { FROM, mailer } from "../../../config/email";
import { inviteEmailHtml, inviteEmailText } from "../../../services/email/templates/inviteEmail";
import { hashToken, randomToken } from "../../../services/utils/crypto";
import { createInviteToken, deleteInviteTokensForUser } from "../../repositories/authRepositories/tokenRepository";
import { getTeacherByEmail } from "../../repositories/teacherRepositories/teacherRepository";

const INVITE_TTL_HOURS = Number(process.env.INVITE_TOKEN_TTL_HOURS || 1);
const WEB_ORIGIN = process.env.WEB_ORIGIN || 'http://localhost:3000';

export async function inviteUseCase({ email, user_id }) {
    console.log("Invite Use Case Invoked with:", email, user_id);
    if (!email || !user_id) {
        return {
            ok: false,
            status: 400,
            message: "Email and user ID are required."
        };
    }

    const { data: teacher, error: fetchError } = await getTeacherByEmail(email.trim());
    if (fetchError || !teacher) {
        return {
            ok: false,
            status: 404,
            message: "No teacher found with the provided email."
        };
    }

    if (teacher.user_id !== user_id) {
        return {
            ok: false,
            status: 400,
            message: "User ID does not match the provided email."
        };
    }

    await deleteInviteTokensForUser(user_id);

    const plain = randomToken(48);
    const hashed = hashToken(plain);

    const { error: storeError } = await createInviteToken(user_id, hashed, INVITE_TTL_HOURS);
    if (storeError) {
        return {
            ok: false,
            status: 500,
            message: "Something went wrong. Please try again."
        };
    }

    const activateUrl = `${WEB_ORIGIN}/activate?token=${encodeURIComponent(plain)}&uid=${encodeURIComponent(user_id)}`;
    const subject = "You're Invited to Join the School Staff Portal";

    await mailer.sendMail({
        from: FROM,
        to: email.trim(),
        subject: subject,
        html: inviteEmailHtml({ fullName: teacher.teacher_full_name, actionUrl: activateUrl }),
        text: inviteEmailText({ fullName: teacher.teacher_full_name, actionUrl: activateUrl })
    });

    return {
        ok: true,
        status: 200,
        message: "Invitation sent successfully."
    };
}