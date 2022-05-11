var express = require('express');

module.exports = (inventory) => {
    var router = express.Router();

    let logs = [];

    router.use(express.json());

    router.get('/inventory', (req, res) => { // View inventory items   
        inventory = [{
            itemId: 23432,
            name: "mac book pro",
            stockAvailable: 100,
            stockOnHand: 2,
            stockHolding: 0,
            stockIncoming: 298,
        }, {
            itemId: 23432,
            name: "mac book pro",
            stockAvailable: 100,
            stockOnHand: 2,
            stockHolding: 0,
            stockIncoming: 298,
        }]
        logs.push('get');
        res.status(200).send({ request: "GET /inventory", inventory, logs });
    });

    router.post('/inventory', (req, res) => { // Create inventory item
        logs.push('post');
        res.status(200).send({ request: "POST /inventory", inventory, logs });
    });

    router.put('/inventory', (req, res) => { // Edit inventory items
        logs.push('put');
        res.status(200).send({ request: "PUT /inventory", inventory, logs });
    });

    router.delete('/inventory', (req, res) => { // Delete inventory item
        logs.push('delete');
        res.status(200).send({ request: "DELETE /inventory", inventory, logs });
    });

    return router;
}