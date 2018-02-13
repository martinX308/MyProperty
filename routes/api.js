var express = require('express');
var router = express.Router();

// link property models
const Property = require('../models/property');

/* GET home page. */
router.get('/api/draw-my-chart/:id', function (req, res, next) {
  const propId = req.params.id;

  Property.findById(propId, 'accountingbook owner', (err, property, next) => {
    if (err) {
      return next(err);
    }

    if (req.user.id !== property.owner.toString()) {
      res.redirect('/properties/my-properties');
      return;
    }

    const costTemplate = {
      'rent': 0,
      'tentant-fee': 0,
      'gas': 0,
      'electricity': 0,
      'appartment-construction': 0,
      'wifi': 0,
      'community': 0,
      'general-maintenance': 0
    };

    const yearInput = 2017;
    const costArray = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const costGraph = [];
    const revGraph = [];

    for (let i = 0; i < 12; i++) { // for all months
      let month = Object.assign({}, costTemplate);
      month['month'] = monthNames[i];
      const monthBalance = {
        month: monthNames[i],
        cost: 50,
        revenue: 100
      };

      property.accountingbook.forEach(element => {
        if (element.date.getFullYear() === yearInput && element.date.getMonth() === i) {
          month[element.name] += element.value;
        }
      });
      costArray.push(month);

      for (const key in month) {
        if (month[key] < 0) {
          monthBalance.cost += month[key];
        } else if (month[key] > 0) {
          monthBalance.revenue += month[key];
        }
      }

      costGraph.push(monthBalance.cost);
      revGraph.push(monthBalance.revenue);
    }

    res.json({yArrayCost: costGraph, yArrayRev: revGraph, xArray: monthNames});
    console.log('123');
  });
});

module.exports = router;
