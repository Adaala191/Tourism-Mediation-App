const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Define routes for Service
router.post('/', serviceController.createService); // Create a new service
router.get('/', serviceController.getAllServices); // Get all services
router.get('/:id', serviceController.getServiceById); // Get a service by ID
router.put('/:id', serviceController.updateService); // Update a service by ID
router.delete('/:id', serviceController.deleteService); // Delete a service by ID

module.exports = router;
