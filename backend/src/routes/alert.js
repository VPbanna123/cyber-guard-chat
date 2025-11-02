

import express from 'express';
import Alert from '../models/Alert.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all alerts
router.get('/', protect, async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('victim', 'username email avatar')
      .populate('bully', 'username email avatar')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update alert status
router.patch('/:alertId/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    const alert = await Alert.findByIdAndUpdate(
      req.params.alertId,
      { status },
      { new: true }
    ).populate('victim bully');

    res.json({ 
      success: true, 
      alert 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const pendingAlerts = await Alert.countDocuments({ status: 'pending' });
    const criticalAlerts = await Alert.countDocuments({ severity: 'critical' });

    res.json({
      success: true,
      stats: {
        total: totalAlerts,
        pending: pendingAlerts,
        critical: criticalAlerts
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
