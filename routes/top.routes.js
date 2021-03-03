const { Router } = require('express');
const Top = require('../models/Top');
const router = Router();

router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    const { time, score, attempts, fieldSize, createAt, playerName } = req.body;
    console.log(req.body);

    const top = new Top({
      attempts,
      time,
      score,
      fieldSize,
      createAt,
      playerName
    });

    await top.save();

    res.status(201).json({ top });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Top
      .find()
      .sort({ score: -1})
      .limit(10);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
