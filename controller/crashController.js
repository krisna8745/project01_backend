// const CrashAviator = require('../models/crashAviator');

// // Create a new crash entry
// exports.createCrashEntry = async (req, res) => {
//     try {
//         const { round_id, crashMultiplier } = req.body;
//         const newEntry = new CrashAviator({ round_id, crashMultiplier });
//         await newEntry.save();
//         res.status(201).json({ success: true, data: newEntry });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get all crash entries
// exports.getAllCrashEntries = async (req, res) => {
//     try {
//         const entries = await CrashAviator.find().sort({ createdAt: -1 });
//         res.status(200).json({ success: true, data: entries });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
// exports.getAllCrashLatestEntries = async (req, res) => {
//     try {
//         const entries = await CrashAviator.findOne();
//         res.status(200).json({ success: true, data: entries });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get a single crash entry by ID
// exports.getCrashEntryById = async (req, res) => {
//     try {
//         const entry = await CrashAviator.findById(req.params.id);
//         if (!entry) {
//             return res.status(404).json({ success: false, message: 'Entry not found' });
//         }
//         res.status(200).json({ success: true, data: entry });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
// exports.getCrashEntryByGameId = async (req, res) => {
//     try {
//         const { round_id } = req.params
//         const entry = await CrashAviator.findOne({ round_id: round_id });
//         if (!entry) {
//             return res.status(404).json({ success: false, message: 'Entry not found' });
//         }
//         res.status(200).json({ success: true, data: entry });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Delete a crash entry by ID
// exports.deleteCrashEntry = async (req, res) => {
//     try {
//         const entry = await CrashAviator.findByIdAndDelete(req.params.id);
//         if (!entry) {
//             return res.status(404).json({ success: false, message: 'Entry not found' });
//         }
//         res.status(200).json({ success: true, message: 'Entry deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


///////////////shrank change


const CrashAviator = require('../models/crashAviator');

// Create a new crash entry
exports.createCrashEntry = async (req, res) => {
    try {
        const { round_id, crashMultiplier } = req.body;
        const newEntry = new CrashAviator({ round_id, crashMultiplier });
        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all crash entries
exports.getAllCrashEntries = async (req, res) => {
    try {
        const entries = await CrashAviator.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllCrashLatestEntries = async (req, res) => {
    try {
        const entries = await CrashAviator.findOne();
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single crash entry by ID
exports.getCrashEntryById = async (req, res) => {
    try {
        const entry = await CrashAviator.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCrashEntryByGameId = async (req, res) => {
    try {
        const { round_id } = req.params
        const entry = await CrashAviator.findOne({ round_id: round_id });
        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a crash entry by ID
exports.deleteCrashEntry = async (req, res) => {
    try {
        const entry = await CrashAviator.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update the next crash point (for admin)
exports.updateNextCrashPoint = async (req, res) => {
    try {
        const { crashPoint } = req.body;
        
        if (!crashPoint || isNaN(crashPoint)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid crash point. Please provide a valid number.' 
            });
        }
        
        // Store the admin-provided crash point in a global variable
        // This will be used by the aviatorSocketController to override the generated crash point
        global.adminCrashPoint = parseFloat(crashPoint);
        
        res.status(200).json({ 
            success: true, 
            message: 'Next crash point updated successfully',
            data: { crashPoint: global.adminCrashPoint }
        });
    } catch (error) {
        console.error('Error updating next crash point:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};