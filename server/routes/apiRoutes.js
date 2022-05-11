var express = require('express');

module.exports = (inventory) => {
    var router = express.Router();

    let logs = [];

    router.use(express.json());

    router.get('/inventory', (req, res) => { // View inventory items   
        logs.push('get');
        res.status(200).send({ request: "GET /inventory", inventory, logs });
    });

    router.post('/inventory', (req, res) => { // Create inventory item
        logs.push('post');
        console.log(req.body);
        res.status(200).send({ request: "POST /inventory", inventory, logs });
    });

    router.put('/inventory', (req, res) => { // Edit inventory items
        const { itemId, newCellData } = req.body;
        logs.push('put');

        if (itemId && newCellData) {
            const indexToEdit = inventory.findIndex(item => item.itemId === itemId);
            inventory[indexToEdit] = newCellData;
            res.status(200).send({ request: "PUT /inventory", inventory, logs });
        } else
            res.status(400).send({ error: "itemId or newCellData haven't been provided" });
    });

    router.delete('/inventory', (req, res) => { // Delete inventory item
        const { itemId } = req.body;
        logs.push('delete');

        if (itemId) {
            inventory = inventory.filter(item => item.itemId !== itemId);
            res.status(200).send({ request: "DELETE /inventory", inventory, logs });
        }
        else
            res.status(400).send({ error: "itemId hasn't been provided" });
    });

    router.get('/reset', (req, res) => { // Testing feature that adds dummy data
        inventory = [{
            itemId: 23432,
            name: "mac book pro",
            stockAvailable: 100,
            stockOnHand: 2,
            stockHolding: 0,
            stockIncoming: 298,
        }, {
            itemId: 34323,
            name: "mac book pro v2",
            stockAvailable: 23,
            stockOnHand: 43,
            stockHolding: 34,
            stockIncoming: 123,
        }]
        logs.push('reset');
        res.status(200).send({ request: "GET /inventory (reset)", inventory, logs });
    });

    return router;
}