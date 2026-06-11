const express =require('express');
const router =express.Router();
const ResumeController=require('../Controllers/resume');
const {upload} = require('../utils/multer')

router.post('/AnalyzeResume',upload.single("resume"),ResumeController.AnalyzeResume);
router.delete('/:id', ResumeController.deleteResume);
router.get('/get/:user',ResumeController.getAllResumeForUser);
router.get('/get',ResumeController.getResumeForAdmin);
module.exports=router;


