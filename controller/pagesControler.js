const bcrypt = require("bcryptjs"); 
const User_Wallet = require('../models/Wallet'); 
const MatkaPage = require('../models/pagematkaModel');
const AarParModel = require('../models/AarParPageModel');
const Avaitorpagemodel = require('../models/AvaitaorPageModel');
// const CricketPageModel=require('../models/CricketPageModel')
const User = require('../models/UserSignUp');
const AgentPageModel=require('../models/AgentPageModel')
const mongoose = require("mongoose");
const matkapagelogin = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await MatkaPage.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new MatkaPage({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const avaitorpagesignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await Avaitorpagemodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Avaitorpagemodel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const aarpaarparchpagelogin = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await AarParModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new AarParModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





// Unified endpoint for creating admin, subadmin, master, and agent
const createUserByRole = async (req, res) => {
  try {
    const {
      username,
      name,
      password,
      balance,
      commType,
      matchComm,
      sessComm,
      casinoComm,
      createdBy,
      role, // 'admin', 'subadmin', 'master', 'agent'
      parentId, // optional parent user ID
      partnership, // partnership percentage with parent
    } = req.body;
console.log(req.body);
    // Validate required fields
    if (!username || !name || !password || balance === undefined || !role) {
      return res.status(400).json({ message: "All required fields are missing" });
    }

    // Validate role
    const validRoles = ['superagent', 'subadmin', 'master', 'agent'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if username already exists
    const existingUser = await AgentPageModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Store parentId as array (simple storage, no validation)
    let parentIdArray = [];
    if (parentId) {
      // Convert parentId to ObjectId and store in array
      try {
        if (mongoose.Types.ObjectId.isValid(parentId)) {
          parentIdArray = [new mongoose.Types.ObjectId(parentId)];
        } else {
          // If not valid ObjectId, store as string in array
          parentIdArray = [parentId];
        }
      } catch (err) {
        console.error("Error processing parentId:", err);
        // Store as string if conversion fails
        parentIdArray = [parentId];
      }
    }

    // Generate unique AgentNo
    let AgentNo;
    let agentCount = 5000;
    do {
      AgentNo = `${agentCount}`;
      agentCount++;
    } while (await AgentPageModel.findOne({ AgentNo }));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new AgentPageModel({
      username,
      name,
      password: hashedPassword,
      balance,
      commType: commType || "Bet by Bet",
      matchComm: matchComm || "0",
      sessComm: sessComm || "0",
      casinoComm: casinoComm || "0",
      createdBy: createdBy || "admin",
      AgentNo,
      pwd: password,
      role,
      parentId: parentIdArray,
      partnership: partnership || 0,
      parentLayers: [] // empty array for now
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
        AgentNo: savedUser.AgentNo,
        balance: savedUser.balance,
        role: savedUser.role,
        parentId: savedUser.parentId || [],
        partnership: savedUser.partnership,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const agentcreate = async (req, res) => {
  try {
    const {
      username,
      name,
      password,
      balance,
      commType,
      matchComm,
      sessComm,
      casinoComm,
      createdBy, // optional
    } = req.body;

    if (!username || !name || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await AgentPageModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate unique AgentNo
    let AgentNo;
    let agentCount = 5000;
    do {
      AgentNo = `${agentCount}`;
      agentCount++;
    } while (await AgentPageModel.findOne({ AgentNo }));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new AgentPageModel({
      username,
      name,
      password: hashedPassword,
      balance,
      commType: commType || "Bet by Bet",
      matchComm: matchComm || "0",
      sessComm: sessComm || "0",
      casinoComm: casinoComm || "0",
      createdBy: createdBy || "admin",
      AgentNo,
      pwd:password,
      role: 'agent' // default role for backward compatibility
    });

    const savedAgent = await newAgent.save();

    res.status(201).json({
      message: "Agent created successfully",
      user: {
        id: savedAgent._id,
        username: savedAgent.username,
        name: savedAgent.name,
        AgentNo: savedAgent.AgentNo,
        balance: savedAgent.balance,
      },
    });
  } catch (err) {
    console.error("Error creating agent:", err);
    res.status(500).json({ message: "Server error" });
  }
};






const titlipagesignup = async (req, res) => {
 
  try {
    const { username, email, password, balance } = req.body;

    if (!username || !email || !password || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await CricketPageModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new CricketPageModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save user first
    const savedUser = await newUser.save();

    // Create wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: balance, // Store initial balance
    });

    const savedWallet = await wallet.save();

    // Link wallet to user
    savedUser.wallet = savedWallet._id;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        balance: savedWallet.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Pages login
const avaitoradminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await Avaitorpagemodel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const matkaadminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await MatkaPage.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const titliadminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await AarParModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const cricketpageadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await CricketPageModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const paymentpageadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in DB
    const user = await AarParModel.findOne({ email }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with user details (without JWT)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};








const agentLogin = async (req, res) => {
  try {
    const { AgentNo, password,role } = req.body;

    if (!AgentNo || !password || !role) {
      return res.status(400).json({ message: "AgentNo and password are required" });
    }

    // Find agent by AgentNo
    const agent = await AgentPageModel.findOne({ AgentNo,role });
    if (!agent) {
      return res.status(401).json({ message: "Invalid AgentNo or password" });
    }

    if (agent.role !== role) {
      return res.status(401).json({message:"Invalid"});
    }
       

    // Compare password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid AgentNo or password" });
    }

    // ✅ Send all required agent info
    res.status(200).json({
      message: "Login successful",
      agent: {
        id: agent._id,
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const getAgentProfile = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Find agent by ID
    const agent = await AgentPageModel.findById({_id:agentId});

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    // Return the relevant agent data
    res.json({
      success: true,
      data: {
        AgentNo: agent.AgentNo,
        balance: agent.balance,
        matchComm: agent.matchComm,
        sessComm: agent.sessComm, 
        casinoComm: agent.casinoComm,
        createdBy: agent.createdBy,
        commType: agent.commType,
        username: agent.username,
      
        // Add any other fields you want to send
      },
    });
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};




const profileContext=  async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user and wallet by ID
   
    const user = await AgentPageModel.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with username, wallet balance, exposure balance, and email
    res.json({ 
      username: user.username, 
      name: user.name,
      balance: user.balance, 
      AgentNo: user.AgentNo,
      commType: user.commType,
      matchComm: user.matchComm,
      sessComm: user.sessComm
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const UserTransaction=require('../models/UserTransaction')

const createclientsbyagent = async (req, res) => {
  const { name, number, password, coins, agent } = req.body;
 

  // Validate input
  if (!name || !number || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: number }); // `number` is treated as email/phone
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique user number
    let userNo;
    let count = 5000;
    do {
      userNo = `C${count}`;
      count++;
    } while (await User.findOne({ userNo }));

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (mapped fields)
    const newUser = new User({
      username: number,
      email: name,
      password: hashedPassword,
      userNo,
      agent,
      pwd:password
    });

    const savedUser = await newUser.save();

    const newTransaction = new UserTransaction({
      userNo:userNo,
      agentNo:agent,
      deposit: coins,
      withdrawal: 0,
      currentBalance:coins
    });

    await newTransaction.save();


    // Create a wallet for the user
    const wallet = new User_Wallet({
      user: savedUser._id,
      balance: coins
    });

    await wallet.save();

    // Link wallet to the user
    savedUser.wallet = wallet._id;
    await savedUser.save();

    const agentWallet=await AgentPageModel.findOne({AgentNo:agent});
    agentWallet.balance-=coins;
    await agentWallet.save();


    // Respond with success
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        userNo: savedUser.userNo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



const getagentclient = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find({ agent: id }).populate('wallet');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateclientbalance = async (req, res) => {
  try {
    const { clientId, amount, type, code, name, AgentNo } = req.body;
    console.log('Update request body:', req.body);
     let deposite=0;
     let withdrawal=0;
     
    if (!clientId || !amount || !type || !AgentNo) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const user = await User.findById(clientId).populate('wallet');
    const agent = await AgentPageModel.findOne({ AgentNo });

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    if (!user || !user.wallet) {
      return res.status(404).json({ success: false, message: 'User or wallet not found' });
    }

    let newBalance = user.wallet.balance;

    if (type === 'add') {
      if (agent.balance < numericAmount) {
        return res.status(400).json({ success: false, message: 'Insufficient agent balance' });
      }
      deposite=numericAmount;
      newBalance += numericAmount;
      agent.balance -= numericAmount;
    } else if (type === 'minus') {
      newBalance -= numericAmount;
      if (newBalance < 0) newBalance = 0; // Prevent negative user balance
      agent.balance += numericAmount;
      withdrawal=numericAmount;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    // Save updates
    user.wallet.balance = newBalance;
    await user.wallet.save();
    await agent.save();

    console.log(`Updated balance for client: ${code} (${name}) - New balance: ${newBalance}`);


    const newTransaction = new UserTransaction({
      userNo:user.userNo,
      agentNo:AgentNo,
      deposit: deposite,
      withdrawal: withdrawal,
      currentBalance:newBalance
    });

    await newTransaction.save();


    res.status(200).json({
      success: true,
      message: 'Balance updated successfully',
      balance: newBalance,
      clientDetails: {
        code,
        name
      }
    });
  } catch (error) {
    console.error('Error updating client balance:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



const getuserdepositeandwidhrwallist = async (req, res) => {
  try {
    const { id } = req.params;

    const userTransaction = await UserTransaction.find({ userNo: id });

    res.status(200).json({
      success: true,
      data: userTransaction
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = {createUserByRole,getuserdepositeandwidhrwallist,updateclientbalance,getagentclient,createclientsbyagent,profileContext,getAgentProfile,agentLogin,paymentpageadmin,titlipagesignup,cricketpageadmin,agentcreate, titliadminlogin,matkaadminlogin,matkapagelogin ,avaitorpagesignup ,aarpaarparchpagelogin,avaitoradminlogin};
