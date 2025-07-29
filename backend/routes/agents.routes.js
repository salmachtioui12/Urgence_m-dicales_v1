const express = require('express');
const router = express.Router();
const { getAgents } = require('../services/agents.service');

router.get('/', (req, res) => res.json(getAgents()));

module.exports = router;