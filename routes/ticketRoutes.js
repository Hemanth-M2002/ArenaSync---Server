const express = require('express');
const { registerTicket, getMyTickets } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all ticket routes
router.use(protect);

router.post('/', registerTicket);
router.get('/my-tickets', getMyTickets);

module.exports = router;
