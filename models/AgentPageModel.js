const mongoose = require('mongoose');

const parentLayerSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentPageModel' },
  parentUsername: { type: String },
  parentName: { type: String },
  role: { type: String },
  partnership: { type: Number, default: 0 }, // partnership percentage
  level: { type: Number } // hierarchy level
}, { _id: false });

const agentPageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },     
  password: { type: String, required: true }, 
  balance: { type: Number, default: 0 },      // e.g., 10000
  commType: { type: String, default: 'Bet by Bet' },
  matchComm: { type: String, default: '0' },
  sessComm: { type: String, default: '0' },
  casinoComm: { type: String, default: '0' },
  createdBy: { type: String, default: 'admin' },
  AgentNo: { type: String },                  // optional
  pwd: { type: String, default: '*****' },
  // New fields for hierarchy and partnership
  role: { type: String, enum: ['superagent', 'subadmin', 'master', 'agent'], required: true },
  parentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPageModel' }], // array of parent IDs
  partnership: { type: Number, default: 0 }, // partnership percentage with parent
  parentLayers: [parentLayerSchema], // array of parent hierarchy
}, { timestamps: true });

const AgentPageModel = mongoose.model('AgentPageModel', agentPageSchema);
module.exports = AgentPageModel;
