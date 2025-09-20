import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import teacherRouter from './routes/teacher.routes.js'
import leaveRouter from './routes/leaves.routes.js'
import authRouter from './routes/auth.routes.js'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'
import inviteRouter from './routes/invite.routes.js'
import { startTokenCleanupJob } from './services/jobs/cleanupTokens.js'
import meRouter from './routes/me.routes.js'

dotenv.config()
const app = express()

// middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: [process.env.WEB_ORIGIN_TEACHER, process.env.WEB_ORIGIN_ADMIN],
	credentials: true
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // 100 requests per 15 minutes
app.use("/api/auth", authLimiter);
app.use("/api/teacher", authLimiter);
app.use("/api/leave", authLimiter);

app.get('/health', (_req, res) => res.json({ ok: true }));

// register routers
app.use("/api/auth", authRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/invite", inviteRouter)
app.use("/api", meRouter);

startTokenCleanupJob();

export default app