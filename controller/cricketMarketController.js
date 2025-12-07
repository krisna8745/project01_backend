const Bet = require('../models/cricketMarketModel');
const User_Wallet = require('../models/Wallet');
const MatchK = require("../models/marketLogicModel")

exports.createBet = async (req, res) => {
    try {
        const { myBets } = req.body;
        console.log(req.body,"todat");

        if (!myBets || !Array.isArray(myBets)) {
            return res.status(400).json({ error: "Invalid bet data" });
        }

        const betsToSave = [];

        for (const betData of myBets) {
            const {
                userId,
                label: matbet,
                type: mode,
                odds,
                rate,
                stake,
                teamAProfit: profitA,
                teamBProfit: profitB,
                balance,
                exposure,
                currentExposure,
                runs,
                matchName
            } = betData;

            const parsedExposure = Math.abs(Number(exposure) || 0);

            // Check if user wallet exists
            let userWallet = await User_Wallet.findOne({ user: userId });

            if (!userWallet) {
                console.log(`User wallet not found for userId: ${userId}`);
                return res.status(400).json({ error: "User wallet not found" });
            }

            // Ensure exposureBalance is a number
            userWallet.exposureBalance = Number(userWallet.exposureBalance) || 0;

            // Check for opposite mode bets with same match and label
            const oppositeMode = mode === "yes" ? "no" : "yes";

            const previousOppositeBet = await Bet.findOne({
                userId,
                matbet,
                mode: oppositeMode,
                matchName,
                result: "Pending"
            });
            // console.log("bets hai", previousOppositeBet)
            if (previousOppositeBet) {
                const prevRuns = oppositeMode === "yes" ? previousOppositeBet.yesRuns : previousOppositeBet.noRuns;
                // console.log("previose bet", prevRuns)
                if (prevRuns === runs) {
                    // If runs match, update wallet and save bet
                    const prevExposure = Math.abs(Number(previousOppositeBet.exposure) || 0);
                    const prevProfitA = Math.abs(Number(previousOppositeBet.profitA) || 0);
                    const newProfitA = Math.abs(Number(profitA) || 0);
                    const prevstake=Math.abs(Number(previousOppositeBet.stake)||0);
                    const newstake=Math.abs(Number(stake)||0);
                    const prerate=Math.abs(Number(previousOppositeBet.rate)||0);
                    const YesRuns = mode === "yes" ? runs : undefined;
                    const NoRuns = mode === "no" ? runs : undefined;

                    if(previousOppositeBet.stake>stake){
                         
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: 0,
                            profitB: 0,
                            balance,
                            exposure:0,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                            result:'complete'
                          
                        });
    
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=Math.abs(prevProfitA - parsedExposure);
                        previousOppositeBet.exposure = Math.abs(prevExposure-newProfitA);
                      
                        userWallet.sessionexposure+= (prevExposure-newProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(prevExposure-newProfitA));
                        await userWallet.save();
                        // previousOppositeBet.result = "cancel";
                        // previousOppositeBet.exposure = Math.abs(Math.abs(prevExposure + prevProfitA) - Math.abs(newProfitA + parsedExposure))
                        await previousOppositeBet.save();
                    }else if(previousOppositeBet.stake<stake){
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: Math.abs(newProfitA-prevExposure),
                            profitB: 0,
                            balance,
                            exposure:Math.abs(parsedExposure-prevProfitA),
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                          
                        });
    
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=0;
                        previousOppositeBet.exposure = 0;
                     
                        userWallet.sessionexposure+= (parsedExposure-prevProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(parsedExposure-prevProfitA));
                        await userWallet.save();
                        previousOppositeBet.result = "complete";
                        // previousOppositeBet.exposure = Math.abs(Math.abs(prevExposure + prevProfitA) - Math.abs(newProfitA + parsedExposure))
                        await previousOppositeBet.save();
                    }else if(previousOppositeBet.stake===stake){
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: 0,
                            profitB: 0,
                            balance,
                            exposure: 0,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                            result:'cancel'
                          
                        });
                        
   
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=0;
                        previousOppositeBet.exposure = Math.abs(prevExposure - newProfitA);
                        // const exposureUpdate = Math.abs(prevProfitA - newProfitA) + Math.abs(prevExposure-parsedExposure)-prevExposure;
                        // const exposureUpdate = Math.abs(Math.abs(prevExposure + prevProfitA) - Math.abs(newProfitA + parsedExposure)) - prevExposure;
                        // userWallet.exposureBalance += exposureUpdate;
                        userWallet.sessionexposure+= Math.abs(prevExposure - newProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(prevExposure-newProfitA));
                        await userWallet.save();
                        previousOppositeBet.result = "cancel";
                        // previousOppositeBet.exposure = Math.abs(Math.abs(prevExposure + prevProfitA) - Math.abs(newProfitA + parsedExposure))
                        await previousOppositeBet.save();
                    }

                } else if (prevRuns > runs&&previousOppositeBet.mode=="no"&&mode=="yes"||prevRuns < runs&&previousOppositeBet.mode=="yes"&&mode=="no") {
                  
                // console.log("previose bet", prevRuns)
              
                    // If runs match, update wallet and save bet
                    const prevExposure = Math.abs(Number(previousOppositeBet.exposure) || 0);
                    const prevProfitA = Math.abs(Number(previousOppositeBet.profitA) || 0);
                    const newProfitA = Math.abs(Number(profitA) || 0);
                    const prevstake=Math.abs(Number(previousOppositeBet.stake)||0);
                    const newstake=Math.abs(Number(stake)||0);
                    const prerate=Math.abs(Number(previousOppositeBet.rate)||0);
                    const YesRuns = mode === "yes" ? runs : undefined;
                    const NoRuns = mode === "no" ? runs : undefined;

                    if(previousOppositeBet.stake>stake){
                         
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: 0,
                            profitB: 0,
                            balance,
                            exposure:0,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                            result:'complete'
                          
                        });
    
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=Math.abs(prevProfitA - parsedExposure);
                        previousOppositeBet.exposure = Math.abs(prevExposure-newProfitA);
                        previousOppositeBet.profitB=Math.abs(prevProfitA+newProfitA);
                        userWallet.sessionexposure+= (prevExposure-newProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(prevExposure-newProfitA));
                        await userWallet.save();
                        previousOppositeBet.result = "canceltype2";
                        previousOppositeBet.prevRuns=runs;
                        await previousOppositeBet.save();
                    }else if(previousOppositeBet.stake<stake){
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: Math.abs(newProfitA-prevExposure),
                            profitB: Math.abs(prevProfitA+newProfitA),
                            balance,
                            exposure:Math.abs(parsedExposure-prevProfitA),
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                            prevRuns:prevRuns,
                            result:'canceltype2'
                          
                        });
    
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=0;
                        previousOppositeBet.exposure = 0;
                     
                        userWallet.sessionexposure+= (parsedExposure-prevProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(parsedExposure-prevProfitA));
                        await userWallet.save();
                        previousOppositeBet.result = "complete";
                        // previousOppositeBet.exposure = Math.abs(Math.abs(prevExposure + prevProfitA) - Math.abs(newProfitA + parsedExposure))
                        await previousOppositeBet.save();
                    }else if(previousOppositeBet.stake===stake){
                        const bet = new Bet({
                            userId,
                            matbet,
                            mode,
                            odds,
                            rate,
                            stake,
                            profitA: 0,
                            profitB: 0,
                            balance,
                            exposure: 0,
                            yesRuns: YesRuns,
                            noRuns: NoRuns,
                            matchName,
                            result:'cancel'
                          
                        });
                        
   
                        betsToSave.push(bet);
                        previousOppositeBet.profitA=0;
                        previousOppositeBet.exposure = Math.abs(prevExposure - newProfitA);
                        previousOppositeBet.profitB=Math.abs(prevProfitA+newProfitA);
              
                        userWallet.sessionexposure+= Math.abs(prevExposure - newProfitA)-prevExposure;
                        userWallet.balance += (prevExposure-(prevExposure-newProfitA));
                        await userWallet.save();
                        previousOppositeBet.result = "canceltype2";
                        previousOppositeBet.prevRuns=runs;
                        await previousOppositeBet.save();
                    }
               
                } else {

                const expectedBalance = userWallet.balance - parsedExposure;

                if (expectedBalance < 0) {
                    return res.status(400).json({ error: "Insufficient balance to place bet" });
                 }

                    const YesRuns = mode === "yes" ? runs : undefined;
                    const NoRuns = mode === "no" ? runs : undefined;

                    // Create Bet Entry
                    const bet = new Bet({
                        userId,
                        matbet,
                        mode,
                        odds,
                        rate,
                        stake,
                        profitA,
                        profitB,
                        balance,
                        exposure,
                        yesRuns: YesRuns,
                        noRuns: NoRuns,
                        matchName
                    });

                    betsToSave.push(bet);
                   userWallet.balance-= parsedExposure;
                   userWallet.sessionexposure += parsedExposure;
                    await userWallet.save();

                }
            } else {
                // No opposite bet found, update wallet and save normally
                const newProfitA = Math.abs(Number(profitA) || 0);
                const expectedBalance = userWallet.balance - parsedExposure;

                if (expectedBalance < 0) {
                    return res.status(400).json({ error: "Insufficient balance to place bet" });
                }
                const YesRuns = mode === "yes" ? runs : undefined;
                const NoRuns = mode === "no" ? runs : undefined;

                // Create Bet Entry
                const bet = new Bet({
                    userId,
                    matbet,
                    mode,
                    odds,
                    rate,
                    stake,
                    profitA:newProfitA,
                    profitB,
                    balance,
                    exposure,
                    yesRuns: YesRuns,
                    noRuns: NoRuns,
                    matchName
                });

                betsToSave.push(bet);
                userWallet.balance-= parsedExposure;
                userWallet.sessionexposure += parsedExposure;
                await userWallet.save();

                console.log(`Wallet updated normally for ${userId}: Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);
            }


        }

        // Save all bets in one go
        if (betsToSave.length > 0) {
            const savedBets = await Bet.insertMany(betsToSave);
           
            return res.status(201).json(savedBets);
        } else {
            return res.status(400).json({ error: "No valid bets to save" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all bets
exports.getAllBets = async (req, res) => {
    try {
        const bets = await Bet.find();
        // console.log(bets, "bets");
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bets by userId
exports.getBetsByUser = async (req, res) => {
    try {
        console.log(req.params.userId);
        // const matchOddsData = await MatchK.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        const bets = await Bet.find({ userId: req.params.userId, matchName: req.params.match }).sort({ createdAt: -1 });



        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBetsByUser2 = async (req, res) => {
    try {
        console.log(req.params.userId);
        // const matchOddsData = await MatchK.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        const bets = await Bet.find({ userId: req.params.userId}).sort({ createdAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBetsByMatch = async (req, res) => {
    try {
        // console.log(req.params.userId);
        const bets = await Bet.find({ matbet: req.params.matbet }).sort({ createdAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBetsByMatchNameAndSession = async (req, res) => {
    try {
        // console.log(req.params.userId);
        const { matchName } = req.params
        const bets = await Bet.find({ matchName: matchName }).sort({ createdAt: 1 });
        console.log(bets)

        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete bet by ID
exports.deleteBet = async (req, res) => {
    try {
        await Bet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.resetAllBet = async (req, res) => {
    try {
        await Bet.deleteMany({});
        res.json({ message: 'All bets deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
