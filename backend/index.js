const express = require('express');
require('./connection');
const cors =require('cors');

const app = express();
const port = 4000;

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:5173",
    "https://ai-resu-mate.vercel.app",
    "https://ai-resu-mate-6xbzhc1dt-nishika931s-projects.vercel.app"
  ]
}));

const UserRoutes=require('./Routes/user')
const ResumeRoutes=require('./Routes/resume')

app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)

app.listen(port, () => {
    console.log(`our backend running on port ${port}`);
});