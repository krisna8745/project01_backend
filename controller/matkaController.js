const Matka = require('../models/matkaModel');
const Bid = require('../models/betModel');
const User_Wallet = require('../models/Wallet');
// Create a new Matka entry
exports.createMatka = async (req, res) => {
    try {
        const newMatka = new Matka(req.body);
        await newMatka.save();
        res.status(201).json({ success: true, message: "Matka entry created", data: newMatka });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Matka entries
exports.getAllMatka = async (req, res) => {
    try {
        const matkas = await Matka.find().sort({ createdAt: -1 });
        res.status(200).json({ matkas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Get a single Matka entry by ID
exports.getMatkaById = async (req, res) => {
    try {
        const matka = await Matka.findById(req.params.id);
        if (!matka) return res.status(404).json({ success: false, message: "Matka entry not found" });

        res.status(200).json({ success: true, data: matka });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Matka entry
exports.updateMatka = async (req, res) => {
    try {
        const updatedMatka = await Matka.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMatka) return res.status(404).json({ success: false, message: "Matka entry not found" });

        res.status(200).json({ success: true, message: "Matka entry updated", data: updatedMatka });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Matka entry
exports.deleteMatka = async (req, res) => {
    try {
        const deletedMatka = await Matka.findByIdAndDelete(req.params.id);
        if (!deletedMatka) return res.status(404).json({ success: false, message: "Matka entry not found" });

        res.status(200).json({ success: true, message: "Matka entry deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change Market Status (Open/Close)
exports.changeMarketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { closeStatus } = req.body; // Should be either "open" or "close"

        if (!["open", "close"].includes(closeStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use 'open' or 'close'." });
        }

        const updatedMatka = await Matka.findByIdAndUpdate(id, { closeStatus }, { new: true });
        if (!updatedMatka) return res.status(404).json({ success: false, message: "Matka entry not found" });

        res.status(200).json({ success: true, message: `Market status changed to ${closeStatus}`, data: updatedMatka });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getcreatedDetail = async (req, res) => {
    try {
        const markets = await Matka.find();
        res.status(200).json(markets);
      } catch (error) {
        res.status(500).json({ message: "Error fetching market data", error });
      }
};


exports.updateMarket = async (req, res) => {
try {
    const marketId = req.params.id;
    const marketData = req.body;  // The updated data coming from the front-end (selectedMarket)

    // Find the market by ID and update it
    const updatedMarket = await Matka.findByIdAndUpdate(marketId, marketData, { new: true });

    if (!updatedMarket) {
      return res.status(404).json({ message: 'Market not found' });
    }

    res.status(200).json(updatedMarket);  // Send back the updated market details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Backend route to delete a market by ID
exports.deleteMarket = async (req, res) => {
    try {
      const marketId = req.params.id;
  
      // Find and delete the market by ID
      const deletedMarket = await Matka.findByIdAndDelete(marketId);
  
      if (!deletedMarket) {
        return res.status(404).json({ message: 'Market not found' });
      }
  
      res.status(200).json({ message: 'Market deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  //////////////////////////////////////////// New Update in matka //////////////////////////////////////////////////////
  

exports.maktaresultdeclaretion = async (req, res) => {
    try {
        const { gameName, bidType, session, result } = req.body;
        console.log(req.body);

        // Fetch bets where result is still pending
        const betData = await Bid.find({ gameName, bidType, Result: "Pending",session:session });
        console.log("Pending Bets:", betData);

        for (let bet of betData) {
            const userWallet = await User_Wallet.findOne({ user: bet.user });

            if (!userWallet) {
                console.error(`Wallet not found for user: ${bet.user}`);
                continue;
            }

            let isWinner = false;

            for (let bid of bet.bids) {
                if (parseInt(bid.number) === parseInt(result)) {
                    userWallet.balance += Number(bet.estimatedProfit);
                    isWinner = true;
                    break;
                }
            }

            // Update Result and Winnings
            bet.Result = "Complete";
            bet.Winnings = isWinner ? bet.estimatedProfit : 0;

            // Save updates
            await userWallet.save();
            await bet.save();
        }

        return res.status(200).json({ message: "Results declared successfully." });

    } catch (error) {
        console.error("Error updating bets:", error);
        return res.status(500).json({ error: "Something went wrong." });
    }
};


