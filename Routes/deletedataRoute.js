const express = require('express');
const router = express.Router();
const User = require("../models/UserSignUp");
const User_Wallet = require("../models/Wallet");
const MatchModel = require('../models/aarParparchiModel');
const CardModel = require('../models/cardsModel');
const Matka = require('../models/matkaModel');
const Bid = require('../models/betModel');
const Bet2 = require('../models/crickbetModel');
const BettingLogic = require('../models/BettingLogic');
const Bet = require('../models/cricketMarketModel');
const MarketLK = require('../models/marketLogicModel');
const papuModel = require('../models/papuModel');
const titliWinnerModel = require('../models/TitliWinner');
const BetAndhr = require('../models/andharModel');
const Mines = require('../models/mines'); 
const Crashavaitor = require('../models/crashAviator'); 
const ClientLedger = require('../models/clientledger');
const AgentPageModel = require('../models/AgentPageModel');
const AgentLedger = require('../models/AgentLedger');
const agentLedgeModel = require('../models/agentLedgeModel');
const Aviator = require('../models/avaitorModel');
const bankDetailsModel = require("../models/bankDetailsModel");
const UserTransaction = require('../models/UserTransaction');
const WinnerModel = require("../models/winnerModel");
const ResultDeclaration = require('../models/resultDeclartion');
const Match = require('../models/matchModel');
const MatkaPage = require('../models/pagematkaModel');
const AarParModel = require('../models/AarParPageModel');
const Avaitorpagemodel = require('../models/AvaitaorPageModel');
const playerModel = require("../models/playerModels");
const SessionResult = require('../models/sessionResultModel');
const addPointModel = require("../models/addPointModel");
const Withdraw = require("../models/withdrawModel");
const TitliMatkaledgerModel = require('../models/TitliMatkaledgerModel');
const MarketControlModel = require('../models/MarketControlModel');
const newsModel = require('../models/newsModel');

router.delete('/admin/delete/Matka', async (req, res) => {
  try {
    await Bid.deleteMany({});
    res.json({ message: 'All Matka bids deleted successfully' });
  } catch (err) {
    console.error('Error deleting Matka bids:', err);
    res.status(500).json({ error: 'Failed to delete Matka bids', details: err.message });
  }
});

// Delete ALL Cricket Related Data
router.delete('/admin/delete/allcricket', async (req, res) => {
  try {
    // Delete in a specific order to handle dependencies
    await Promise.all([
      MarketLK.deleteMany({}),
      Bet2.deleteMany({}),
      Bet.deleteMany({})
    ]);
    res.json({ message: 'All cricket related data deleted successfully' });
  } catch (err) {
    console.error('Error deleting cricket data:', err);
    res.status(500).json({ error: 'Failed to delete cricket data', details: err.message });
  }
});

// // Delete ALL Balances
router.delete('/admin/delete/aarpaarparchi', async (req, res) => {
  try {
    await MatchModel.deleteMany({});
    await CardModel.deleteMany({});
    res.json({ message: 'All aaar Paar data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete ALL Linked Accounts
router.delete('/admin/delete/tittli', async (req, res) => {
  try {
    await papuModel.deleteMany({});
    await titliWinnerModel.deleteMany({});
    await Crashavaitor.deleteMany({});
    res.json({ message: 'All accounts deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete ALL Preferences
router.delete('/admin/delete/andhr', async (req, res) => {
  try {
    await User.deleteMany({});
    await User_Wallet.deleteMany({});
    res.json({ message: 'All preferences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete EVERYTHING - Improved version
router.delete('/admin/delete/mines', async (req, res) => {
  try {
    console.log('Starting complete data deletion...');
    
    // Delete all collections in parallel for better performance
    const deletePromises = [
      // User related
      User.deleteMany({}),
      User_Wallet.deleteMany({}),
      UserTransaction.deleteMany({}),
      bankDetailsModel.deleteMany({}),
      addPointModel.deleteMany({}),
      Withdraw.deleteMany({}),
      
      // Agent related
      AgentPageModel.deleteMany({}),
      AgentLedger.deleteMany({}),
      agentLedgeModel.deleteMany({}),
      ClientLedger.deleteMany({}),
      
      // Game related
      Mines.deleteMany({}),
      Aviator.deleteMany({}),
      Crashavaitor.deleteMany({}),
      Matka.deleteMany({}),
      MatkaPage.deleteMany({}),
      AarParModel.deleteMany({}),
      Avaitorpagemodel.deleteMany({}),
      papuModel.deleteMany({}),
      titliWinnerModel.deleteMany({}),
      TitliMatkaledgerModel.deleteMany({}),
      
      // Cricket related
      Bet2.deleteMany({}),
      Bet.deleteMany({}),
      BetAndhr.deleteMany({}),
      MarketLK.deleteMany({}),
      MarketControlModel.deleteMany({}),
      
      // Card games
      MatchModel.deleteMany({}),
      CardModel.deleteMany({}),
      
      // Other models
      playerModel.deleteMany({}),
      SessionResult.deleteMany({}),
      WinnerModel.deleteMany({}),
      ResultDeclaration.deleteMany({}),
      Match.deleteMany({}),
      Bid.deleteMany({}),
      newsModel.deleteMany({})
    ];

    await Promise.all(deletePromises);
    
    console.log('All data deleted successfully');
    res.json({ 
      success: true,
      message: 'All data deleted successfully from all collections',
      deletedCollections: [
        'Users', 'Wallets', 'Transactions', 'Bank Details', 'Add Points', 'Withdrawals',
        'Agent Pages', 'Agent Ledgers', 'Client Ledgers',
        'Mines', 'Aviator', 'Crash Aviator', 'Matka', 'Matka Pages', 'Aar Par', 'Aviator Pages',
        'Papu', 'Titli Winners', 'Titli Matka Ledger',
        'Cricket Bets', 'Cricket Markets', 'Andhar Bahar', 'Betting Logic', 'Market Logic',
        'Card Games', 'Players', 'Session Results', 'Winners', 'Result Declarations',
        'Matches', 'Bids', 'News'
      ]
    });
  } catch (err) {
    console.error('Error deleting all data:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete all data', 
      details: err.message 
    });
  }
});


router.delete('/admin/delete/dphistory', async (req, res) => {
  try {
    await addPointModel.deleteMany({});
    await Withdraw.deleteMany({});
    res.json({ message: 'All preferences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
