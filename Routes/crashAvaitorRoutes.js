// const express = require('express');
// const router = express.Router();
// const crashAviatorController = require('../controller/crashController');

// // Route to create a new crash entry
// router.post('/avaitor/create/crashpoint', crashAviatorController.createCrashEntry);

// // Route to get all crash entries
// router.get('/avaitor/get/crashpoint', crashAviatorController.getAllCrashEntries);
// router.get('/avaitor/get/latest/crashpoint', crashAviatorController.getAllCrashLatestEntries);

// // Route to get a single crash entry by ID
// router.get('/avaitor/get/crashpoint/:id', crashAviatorController.getCrashEntryById);

// // Route to get all crash entries for a specific game
// router.get('/avaitor/get-gameId/crashpoint/:round_id', crashAviatorController.getCrashEntryByGameId);

// // Route to delete a crash entry by ID
// router.delete('/avaitor/delete/crashpoint/:id', crashAviatorController.deleteCrashEntry);

// module.exports = router;



//////////shryank change 
const express = require('express');
const router = express.Router();
const crashAviatorController = require('../controller/crashController');

// Route to create a new crash entry
router.post('/avaitor/create/crashpoint', crashAviatorController.createCrashEntry);

// Route to get all crash entries
router.get('/avaitor/get/crashpoint', crashAviatorController.getAllCrashEntries);
router.get('/avaitor/get/latest/crashpoint', crashAviatorController.getAllCrashLatestEntries);

// Route to get a single crash entry by ID
router.get('/avaitor/get/crashpoint/:id', crashAviatorController.getCrashEntryById);

// Route to get all crash entries for a specific game
router.get('/avaitor/get-gameId/crashpoint/:round_id', crashAviatorController.getCrashEntryByGameId);

// Route to delete a crash entry by ID
router.delete('/avaitor/delete/crashpoint/:id', crashAviatorController.deleteCrashEntry);

// Route to update the next crash point (for admin)
router.put('/avaitor/update/crashpoint', crashAviatorController.updateNextCrashPoint);

module.exports = router;




