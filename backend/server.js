import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/reviews", reviewRoutes);
app.get('/', (req, res) => {
  res.send('Hello, SkillSphere!');
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});