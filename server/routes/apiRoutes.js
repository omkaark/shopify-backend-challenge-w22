const { default: axios } = require('axios');
var express = require('express');

/* TODO:
 * Add validation for newCellData and send 400 if data not good. Make a method under utils for this
 * Extension tasks
*/

var router = express.Router();

let inventory = [{
    itemId: 23432,
    name: "mac book pro",
    stockAvailable: 100,
    stockIncoming: 298,
}, {
    itemId: 34323,
    name: "mac book pro v2",
    stockAvailable: 23,
    stockIncoming: 123,
}];

let shipments = [];

router.use(express.json());

router.get('/inventory', (req, res) => { // View inventory items  
    res.status(200).send({ request: "GET /inventory", inventory });
});

router.post('/inventory', (req, res) => { // Create inventory item
    const { newCellData } = req.body;

    inventory.push(newCellData);

    res.status(200).send({ request: "POST /inventory", inventory }); // Passing inventory for debugging using Postman
});

router.put('/inventory', (req, res) => { // Edit inventory items
    const { itemId, newCellData } = req.body;

    if (itemId && newCellData) {
        const indexToEdit = inventory.findIndex(item => item.itemId === itemId);
        inventory[indexToEdit] = newCellData;
        res.status(200).send({ request: "PUT /inventory", inventory }); // Passing inventory for debugging using Postman
    } else
        res.status(400).send({ error: "itemId or newCellData haven't been provided" });
});

router.delete('/inventory', (req, res) => { // Delete inventory item
    const { itemId } = req.body;

    if (itemId) {
        inventory = inventory.filter(item => item.itemId !== itemId);
        res.status(200).send({ request: "DELETE /inventory", inventory }); // Passing inventory for debugging using Postman
    }
    else
        res.status(400).send({ error: "itemId hasn't been provided" });
});

router.get('/shipments', (req, res) => { // Get list of shipments
    res.status(200).send({ request: "GET /shipments", shipments });
});

router.post('/shipment', async (req, res) => { // Create shipment
    const { itemId, quantityToShip } = req.body;
    let error = "";
    let inventoryItemIndex = inventory.findIndex(item => itemId === item.itemId);

    if (itemId && inventoryItemIndex !== -1) {
        if (inventory[inventoryItemIndex].stockAvailable - quantityToShip >= 0) {
            inventory[inventoryItemIndex].stockAvailable -= quantityToShip;
            let shipmentInfo = {
                shipmentId: Math.floor(Math.random() * 90000 + 10000),
                itemId: itemId,
                quantity: quantityToShip,
            }
            shipments.push(shipmentInfo);
            res.status(200).send({ request: "POST /shipment", shipmentInfo, shipments }); // Passing shipments for debugging using Postman
        } else {
            res.status(400).send({ error: "Cannot ship inventory that is not available" });
        }
    } else {
        res.status(400).send({ error: "itemId not provided or itemId not found" });
    }
});

router.get('/reset', (req, res) => { // Testing feature that adds dummy data
    inventory = [{
        itemId: 23432,
        name: "mac book pro",
        stockAvailable: 100,
        stockIncoming: 298,
    }, {
        itemId: 34323,
        name: "mac book pro v2",
        stockAvailable: 23,
        stockIncoming: 123,
    }];

    res.status(200).send({ request: "GET /inventory (reset)" });
});

router.get('/debug', (req, res) => { // Testing feature that adds dummy data
    res.status(200).send({ request: "GET /inventory (reset)", inventory });
});

module.exports = router;