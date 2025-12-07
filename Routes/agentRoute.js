const express = require('express');

const {agentLogin,fatchtransctionledgerofmatka,acceptLedgerEntry,fatchAlldetailsoftitli,getAlldetailsofmatkabets,getmatkaledger,getagenttitlipaata,agentgetmatchfinhed,marketcontrolFB,marketcontrolAB,getagentbalaceledger,getagentledgerfatch,updateagentledger,getagentledgeruser,getagentledger2,updateagentbalnce, getagentadmin,getmatchbets,getsessionbets,getagentledger,getclientledgeruser,updateclientledger,getclientledgerfatch} = require('../controller/agentControler');
const router = express.Router();

router.post('/superadmin/login', agentLogin);

router.get('/getmatchbets/:agentId', getmatchbets); 
router.get('/getsessionbets/:agentId', getsessionbets); 
router.get('/agent-ledger/:agentId', getagentledger); 
router.get('/getclientledgeruser/:agentId', getclientledgeruser); 
router.post('/update/client-ledger', updateclientledger); 
router.get('/fatch/get-client-ledger/:agentId', getclientledgerfatch); 
router.get('/getagent/admin', getagentadmin);
router.put('/updateagentlimit/admin/:userId', updateagentbalnce);
router.get('/getagentledger/admin', getagentledger2); 
router.get('/getagent/admin', getagentledgeruser); 
router.post('/agentupdate/agent-ledger', updateagentledger); 
router.get('/agentledgerfatch/get-agent-ledger', getagentledgerfatch);
router.get('/getagentblance/admin/:agentId', getagentbalaceledger); 
router.post('/marketcontrol/admin', marketcontrolAB); 
router.get('/excluded-markets/front', marketcontrolFB); 
router.get('/agentmatch/combined-data',agentgetmatchfinhed);
router.get('/getagenttitlipaata-details/:agentId',getagenttitlipaata);
router.get('/getmatkaledger-details/:agentId',getmatkaledger);
router.get('/superadmin/getAlldetailsofmatkabets',getAlldetailsofmatkabets);
router.get('/superadmin/fatchAlldetailsoftitli',fatchAlldetailsoftitli);
router.post('/superadmin/acceptLedgerEntry',acceptLedgerEntry);
router.get('/admin/fatchtransctionledgerofmatka',fatchtransctionledgerofmatka);
module.exports = router;

