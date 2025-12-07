const MarketLK = require('../models/marketLogicModel');
const User = require('../models/UserSignUp');
const Bet = require('../models/cricketMarketModel');
const agentLedgeModel=require('../models/agentLedgeModel');
const AgentPageModel=require('../models/AgentPageModel');
const ClientLedger=require('../models/clientledger');
const AgentLedger=require('../models/AgentLedger');
const bcrypt = require('bcryptjs');


const getmatchbets = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Step 1: Get all users with the same agent
    const users = await User.find({ agent: agentId }, '_id'); // only fetch _id
    const userIds = users.map(user => user._id); // extract array of ObjectIds

    // Step 2: Get all bets placed by those users
    const bets = await MarketLK.find({ user: { $in: userIds }})
                               .populate('user', 'username email agent userNo'); // optional: populate user info

    res.json(bets);
  } catch (error) {
    console.error('Error fetching bets:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const getsessionbets = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Step 1: Get all users with the same agent
    const users = await User.find({ agent: agentId }, '_id'); // only fetch _id
    const userIds = users.map(user => user._id); // extract array of ObjectIds

    // Step 2: Get all bets placed by those users
    const bets = await Bet.find({ userId: { $in: userIds }})
                               .populate('userId', 'username email agent userNo'); // optional: populate user info

    res.json(bets);
  } catch (error) {
    console.error('Error fetching bets:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};




const getagentledger = async (req, res) => {
  const { agentId } = req.params;
  try {
    const data = await agentLedgeModel.find({agentNo: agentId });
    const agentledge = await AgentPageModel.find({AgentNo: agentId });
    res.json({data:data,agentledge:agentledge});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getclientledgeruser = async (req, res) => {
  const { agentId } = req.params;
  try {
    const data = await User.find({agent: agentId },'email userNo');
    
    res.json({data:data});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateclientledger = async (req, res) => {
  try {
    const {
      agentNo,
      amount,
      clientId,
      collection,
      date,
      paymentType,
      remark
    } = req.body;

    // Validate input
    if (!agentNo || !amount || !clientId || !collection || !date || !paymentType || !remark) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert amount to number
    const amt = Number(amount);
    if (isNaN(amt)) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    // Determine debit or credit based on paymentType
    const debit = paymentType === 'PAYMENT-DIYA' ? amt : 0;
    const credit = paymentType === 'PAYMENT-LIYA' ? amt : 0;

    // For now, set balance equal to debit or -credit
    const balance = debit - credit;

    const newLedger = new ClientLedger({
      agentNo,
      client: clientId,
      collectionName: remark,
      date,
      debit,
      credit,
      balance,
      paymentType:collection,
      doneBy: "client"
    });

    const saved = await newLedger.save();
    res.status(201).json({ message: 'Ledger entry saved', data: saved });

  } catch (error) {
    console.error('Ledger Save Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getclientledgerfatch = async (req, res) => {
  const { agentId } = req.params;
  try {
    const data = await ClientLedger.find({agentNo:agentId });
    
    res.json({data:data});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getagentadmin = async (req, res) => {

  try {
  
    const data = await AgentPageModel.find({});
    res.json({data:data});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};




const updateagentbalnce = async (req, res) => {
  const { userId } = req.params;
  const { balance } = req.body;

  try {
    // Find the agent by ID and update the balance
    const updatedAgent = await AgentPageModel.findByIdAndUpdate(
      userId,
      { balance: Number(balance) },
      { new: true } // return the updated document
    );

    if (!updatedAgent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Agent balance updated successfully',
      agent: updatedAgent,
    });
  } catch (err) {
    console.error('Error updating agent balance:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


const Transaction=require('../models/agentLedgeModel');
const getagentledger2 = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const agentPages = await AgentPageModel.find({});

    const result = [];

    for (const agent of agentPages) {
      const agentNo = agent.AgentNo;
      const matchComm = Number(agent.matchComm);
      const sessComm = Number(agent.sessComm);

      // Filter transactions for this agent
      const agentTxns = transactions.filter(txn => txn.agentNo === agentNo);

      let totalCredit = 0;
      let totalDebit = 0;

      for (const txn of agentTxns) {
        if (txn.comType === "session") {
          totalCredit += Number(txn.credit) - (Number(txn.credit) * sessComm) / 100;
          totalDebit += Number(txn.debit) + (Number(txn.debit) * sessComm) / 100;
        } else {
          totalCredit += Number(txn.credit) - (Number(txn.credit) * matchComm) / 100;
          totalDebit += Number(txn.debit);
        }
      }

      result.push({
        AgentNo: agentNo,
        name: agent.name,
        matchComm,
        sessComm,
        totalCredit,
        totalDebit
      });
    }

    res.status(200).json({ agentSummary: result });
  } catch (err) {
    console.error("Error fetching agent ledger summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const getagentledgeruser = async (req, res) => {
 
  try {
    const data = await AgentPageModel.find({});
    res.json({data:data});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateagentledger = async (req, res) => {
  try {
    const {
      amount,
      clientId,
      collection,
      date,
      paymentType,
      remark
    } = req.body;

    // Validate input
    if ( !amount || !clientId || !collection || !date || !paymentType || !remark) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert amount to number
    const amt = Number(amount);
    if (isNaN(amt)) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    // Determine debit or credit based on paymentType
    const debit = paymentType === 'PAYMENT-DIYA' ? amt : 0;
    const credit = paymentType === 'PAYMENT-LIYA' ? amt : 0;

    // For now, set balance equal to debit or -credit
    const balance = debit - credit;

    const newLedger = new AgentLedger({
      agent: clientId,
      collectionName: remark,
      date,
      debit,
      credit,
      balance,
      paymentType:collection,
      doneBy: "admin"
    });

    const saved = await newLedger.save();
    res.status(201).json({ message: 'Ledger entry saved', data: saved });

  } catch (error) {
    console.error('Ledger Save Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getagentledgerfatch = async (req, res) => {

  try {
    const data = await AgentLedger.find({});
    
    res.json({data:data});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getagentbalaceledger = async (req, res) => {
  const { agentId } = req.params;

  try {
    const result = await AgentLedger.aggregate([
      { $match: { agent: agentId } },
      {
        $group: {
          _id: "$agent",
          totalBalance: { $sum: "$balance" },
          totalDebit: { $sum: "$debit" },
          totalCredit: { $sum: "$credit" }
        }
      }
    ]);

    if (result.length === 0) {
      // If no records found, return zero values
      return res.json({
        agent: agentId,
        totalBalance: 0,
      });
    }

    // Otherwise, return calculated result
    res.json({
      agent: agentId,
      totalBalance: result[0].totalBalance,
    });

  } catch (err) {
    console.error("Error fetching agent balance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const Marketcontrol=require('../models/MarketControlModel');
const marketcontrolAB = async (req, res) => {
  try {
    const { id, type } = req.body;
    console.log(req.body);
    if (!id || !type) {
      return res.status(400).json({ message: 'id and type are required' });
    }

    if (type === 'block') {
      await Marketcontrol.updateOne(
        {},
        { $addToSet: { excludedMarketIds: id } },
        { upsert: true }
      );
    } else if (type === 'Allow') {
      await Marketcontrol.updateOne(
        {},
        { $pull: { excludedMarketIds: id } }
      );
    } else {
      return res.status(400).json({ message: 'Invalid type. Use "Block" or "Allow".' });
    }

    return res.status(200).json({ message: `Market ID ${type === 'Block' ? 'blocked' : 'allowed'} successfully`, id });
  } catch (error) {
    console.error('Error in marketcontrolAB:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const marketcontrolFB = async (req, res) => {
  try {
    const data = await Marketcontrol.findOne({});
    if (!data) return res.status(200).json({ excludedMarketIds: [] });

    res.status(200).json({ excludedMarketIds: data.excludedMarketIds });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const agentgetmatchfinhed = async (req, res) => {
  try {
    const data1 = await MarketLK.find(); // has 'match' and 'createdAt'
    const data2 = await Bet.find();      // has 'matchName' and 'createdAt'

    // Combine match data from both schemas
    const allMatches = [
      ...data1.map(item => ({ name: item.match, time: item.createdAt })),
      ...data2.map(item => ({ name: item.matchName, time: item.createdAt }))
    ].filter(item => item.name); // remove null/undefined names

    // Get unique matches with the oldest time
    const matchMap = new Map();

    allMatches.forEach(item => {
      if (!matchMap.has(item.name)) {
        matchMap.set(item.name, item.time);
      } else {
        const existingTime = matchMap.get(item.name);
        if (new Date(item.time) < new Date(existingTime)) {
          matchMap.set(item.name, item.time);
        }
      }
    });

    // Convert map to array
    const uniqueMatches = Array.from(matchMap, ([matchName, time]) => ({
      matchName,
      time
    }));

    res.status(200).json({
      success: true,
      matches: uniqueMatches
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const papuModel = require('../models/papuModel');


const getagenttitlipaata = async (req, res) => {
  try {
    const { agentId } = req.params;
    console.log(agentId,"agentId");
    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    // Step 1: Find all users with this agentId
    const users = await User.find({ agent: agentId }).select('_id');
    const userIds = users.map(user => user._id);

    if (userIds.length === 0) {
      return res.status(200).json([]); // No users under this agent
    }

    // Step 2: Fetch all bets of these users
    const bets = await papuModel.find({ user: { $in: userIds } })
      .populate({
        path: 'user',
        select: 'userNo agent' // only return userNo and agent
      });

    // Step 3: Prepare result
    const result = bets.map(bet => ({
      _id: bet._id,
      // titliGameId: bet.titliGameId,
      totalBets: bet.totalBets,
      profit: bet.profit,
      isWin: bet.isWin,
      isCompleted: bet.isCompleted,
      // selectedCard: bet.selectedCard,
      // winningImage: bet.winningImage,
      createdAt: bet.createdAt,
      // updatedAt: bet.updatedAt,
      userNo: bet.user?.userNo || null,
      agent: bet.user?.agent || null
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching agent bets:", error);
    res.status(500).json({ message: error.message });
  }
};

const Bid = require('../models/betModel');

const getmatkaledger = async (req, res) => {
  try {
    const { agentId } = req.params;
    console.log(agentId,"agentId");
    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    // Step 1: Find all users with this agentId
    const users = await User.find({ agent: agentId }).select('_id');
    const userIds = users.map(user => user._id);

    if (userIds.length === 0) {
      return res.status(200).json([]); // No users under this agent
    }

    // Step 2: Fetch all bets of these users with completed results
    const bets = await Bid.find({ 
      user: { $in: userIds },
      Result: "Complete"
    })
      .populate({
        path: 'user',
        select: 'userNo agent' // only return userNo and agent
      });

    // Step 3: Prepare result
    const result = bets.map(bet => ({
      _id: bet._id,
      // titliGameId: bet.titliGameId,
      totalBets: bet.totalBidPoints,
      profit: bet.Winnings,
      isWin: bet.Winnings > 0 ? true : false,
      isCompleted: bet.Result,
      // selectedCard: bet.selectedCard,
      // winningImage: bet.winningImage,
      createdAt: bet.createdAt,
      // updatedAt: bet.updatedAt,
      userNo: bet.user?.userNo || null,
      agent: bet.user?.agent || null
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching agent bets:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAlldetailsofmatkabets = async (req, res) => {
  try {
    const data = await Bid.find({ Result: "Complete" }).populate({
      path: 'user',
      select: 'userNo agent'
    });

    if (!data) return res.status(200).json({ data: [] });

    const agentSummary = {};

    data.forEach((entry) => {
      const agentId = entry.user?.agent;
      if (!agentId) return;

      const winnings = parseFloat(entry.Winnings); // Ensure numeric
      const bidPoints = parseFloat(entry.totalBidPoints);

      if (!agentSummary[agentId]) {
        agentSummary[agentId] = {
          agent: agentId,
          winAmount: 0,
          lossAmount: 0,
          totalBets: 0
        };
      }

      // Count the bet
      agentSummary[agentId].totalBets += 1;

      // Add win/loss
      if (winnings > 0) {
        agentSummary[agentId].winAmount += winnings;
      } else {
        agentSummary[agentId].lossAmount += bidPoints;
      }
    });

    const result = Object.values(agentSummary);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const fatchAlldetailsoftitli = async (req, res) => {
  try {
    const data = await papuModel.find({}).populate({
      path: 'user',
      select: 'userNo agent'
    });

    if (!data) return res.status(200).json({ data: [] });

    const agentSummary = {};

    data.forEach((entry) => {
      const agentId = entry.user?.agent;
      if (!agentId) return;

      const winnings = parseFloat(entry.profit); // Ensure numeric
      const bidPoints = parseFloat(entry.totalBets);

      if (!agentSummary[agentId]) {
        agentSummary[agentId] = {
          agent: agentId,
          winAmount: 0,
          lossAmount: 0,
          totalBets: 0
        };
      }

      // Count the bet
      agentSummary[agentId].totalBets += 1;

      // Add win/loss
      if (winnings > 0) {
        agentSummary[agentId].winAmount += winnings;
      } else {
        agentSummary[agentId].lossAmount += bidPoints;
      }
    });

    const result = Object.values(agentSummary);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const MatkaTitli = require('../models/TitliMatkaledgerModel');

const acceptLedgerEntry = async (req, res) => {
  try {
    const {
      agentId,
      calculationBreakdown,
      processedBy,
      processingNotes,
      status
    } = req.body;

    if (
      !agentId ||
      !calculationBreakdown ||
      !calculationBreakdown.totalBreakdown ||
      calculationBreakdown.totalBreakdown.totalLena == null ||
      calculationBreakdown.totalBreakdown.totalDena == null ||
      calculationBreakdown.totalBreakdown.totalCommission == null ||
      calculationBreakdown.totalBreakdown.netAmount == null ||
      !processedBy ||
      !processingNotes ||
      !status
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const {
      totalLena,
      totalDena,
      totalCommission,
      netAmount
    } = calculationBreakdown.totalBreakdown;

    // Auto-assign type
    let type = "Neutral";
    if (netAmount > 0) type = "Lena";
    else if (netAmount < 0) type = "Dena";

    const entry = new MatkaTitli({
      agentId,
      totalLena,
      totalDena,
      totalCom: totalCommission,
      netAmount,
      type,
      acceptedAt: processingNotes,
      status,
      processedBy,
      processingNotes
    });

    await entry.save();

    res.status(201).json({ message: 'MatkaTitli entry saved successfully', data: entry });
  } catch (error) {
    console.error('Error saving MatkaTitli entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const fatchtransctionledgerofmatka = async (req, res) => {
  try {
    const data = await MatkaTitli.find({});
    if (!data) return res.status(200).json({ data: [] });

    res.status(200).json({ data: data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const agentLogin = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing credentials - username:', username, 'password:', password ? '***' : 'missing');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find agent by username
    const agent = await AgentPageModel.findOne({ username });
    if (!agent) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Return agent details
    res.status(200).json({
      message: 'Login successful',
      agent: {
        id: agent._id,
        userId: agent._id,
        username: agent.username,
        name: agent.name,
        AgentNo: agent.AgentNo,
        balance: agent.balance,
        commType: agent.commType,
        matchComm: agent.matchComm,
        sessComm: agent.sessComm,
        casinoComm: agent.casinoComm,
        createdBy: agent.createdBy,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  agentLogin, fatchtransctionledgerofmatka, acceptLedgerEntry, fatchAlldetailsoftitli,  getAlldetailsofmatkabets,getmatkaledger, getagenttitlipaata,agentgetmatchfinhed, marketcontrolFB,marketcontrolAB,getmatchbets ,getsessionbets,getagentledger,getclientledgeruser,updateclientledger,getclientledgerfatch,getagentadmin,updateagentbalnce,getagentledger2,getagentledgeruser,updateagentledger,getagentledgerfatch,getagentbalaceledger
};
