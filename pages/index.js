import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/index.module.css';
import axios from 'axios';

export default function App() {
  let [inventory, setInventory] = useState([]);
  let [shipments, setShipments] = useState([]);
  let [addShipmentMode, setAddShipmentMode] = useState(false);
  let [shipmentToBeAdded, setShipmentToBeAdded] = useState({
    itemId: "na",
    quantity: 0,
  });

  const createInventoryItem = async () => {
    let newInventory = [...inventory, {
      itemId: null,
      name: "",
      stockAvailable: 0,
      stockIncoming: 0
    }];

    setInventory(newInventory);
  };

  const createDummyInventoryItem = async () => {
    saveCreatedInventoryItem({
      itemId: Math.floor(Math.random() * 90000) + 10000,
      name: `Product ${(Math.random() + 1).toString(36).substring(5)}`,
      stockAvailable: Math.floor(Math.random() * 100),
      stockIncoming: Math.floor(Math.random() * 100)
    });
  }

  const saveCreatedInventoryItem = async (newCellData) => {
    let newInventory = [...inventory, newCellData];

    if (newCellData.itemId) {
      let res = await axios.post('/api/inventory', {
        newCellData: newCellData
      });

      res.status === 200 && setInventory(newInventory);
    }
  };

  const editInventoryItem = async (idx, newCellData) => {
    let newInventory = [...inventory];
    newInventory[idx] = newCellData;

    let res = await axios.put('/api/inventory', {
      itemId: newCellData.itemId,
      newCellData: newCellData
    });

    res.status === 200 && setInventory(newInventory);
  };

  const deleteInventoryItem = async (idx, itemId) => {
    let newInventory = [...inventory];
    newInventory.splice(idx, 1);

    let res = await axios.delete('/api/inventory', {
      data: {
        itemId: itemId
      }
    });

    res.status === 200 && setInventory(newInventory);
  };

  const InventoryCell = ({ data, idx }) => {

    const [cellData, setCellData] = useState({});
    const [isEditMode, setIsEditMode] = useState(data.itemId ? false : true);
    const [newCell, setNewCell] = useState(data.itemId ? false : true);

    useEffect(() => {
      setCellData(data);
    }, []);

    return (
      isEditMode ? (<tr className={styles.inventoryCell} >
        <td>
          <input placeholder='Input a number' type='number' value={cellData.itemId} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              itemId: parseInt(e.target.value)
            };
          })} />
        </td>
        <td>
          <input placeholder='Input a name' value={cellData.name} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              name: e.target.value
            };
          })} />
        </td>
        <td>
          <input placeholder='Input a number' type='number' value={cellData.stockAvailable} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockAvailable: parseInt(e.target.value)
            };
          })} />
        </td>
        <td>
          <input placeholder='Input a number' type='number' value={cellData.stockIncoming} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockIncoming: parseInt(e.target.value)
            };
          })} />
        </td>
        <td>
          <button onClick={() => {
            setIsEditMode(false);
            newCell ? saveCreatedInventoryItem(cellData) : editInventoryItem(idx, cellData);
          }}>Save</button>
        </td>
      </tr >) :
        (<tr className={styles.inventoryCell}>
          <td>{cellData.itemId}</td>
          <td>{cellData.name}</td>
          <td>{cellData.stockAvailable}</td>
          <td>{cellData.stockIncoming}</td>
          <td>
            <button onClick={() => setIsEditMode(true)}>Edit</button>
            <button onClick={() => deleteInventoryItem(idx, cellData.itemId)}>Delete</button>
          </td>
        </tr>)
    );
  }

  useEffect(() => {
    axios.get('/api/inventory')
      .then(res => res.data)
      .then(data => setInventory(data.inventory));

    axios.get('/api/shipments')
      .then(res => res.data)
      .then(data => setShipments(data.shipments));
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Head>
        <title>Inventory Management</title>
      </Head>
      <div>
        <button style={{ padding: "10px", margin: "10px", backgroundColor: "#eee", border: "1px solid #000" }} onClick={createInventoryItem}>Create New Inventory Item</button>
        <button style={{ padding: "10px", margin: "10px", backgroundColor: "#eee", border: "1px solid #000" }} onClick={createDummyInventoryItem}>Create Dummy Inventory Item</button>
      </div>
      <table className={styles.table}>
        <tr>
          <th>Item ID</th>
          <th>Name</th>
          <th>Stock Available</th>
          <th>Stock Incoming</th>
          <th>Actions</th>
        </tr>
        {inventory.map((data, idx) => <InventoryCell key={idx} idx={idx} data={data} />)}
      </table>
      <div>
        <button style={{ padding: "10px", margin: "10px", marginTop: "30px", backgroundColor: "#eee", border: "1px solid #000" }} onClick={() => setAddShipmentMode(true)}>Create New Shipment</button>
      </div>
      {addShipmentMode ? <div>
        <select id="itemId" value={shipmentToBeAdded.itemId} onChange={(e) =>
          setShipmentToBeAdded(val => ({
            ...val,
            itemId: e.target.value
          }))
        }>
          <option selected disabled value="na">Choose the itemId</option>
          {inventory.map(i => <option key={i.itemId} value={i.itemId}>{i.itemId}</option>)}
        </select>
        <input style={{ minWidth: "200px" }} type="number" placeholder="Quantity of stock to ship" onChange={(e) =>
          setShipmentToBeAdded(val => ({
            ...val,
            quantity: parseInt(e.target.value)
          }))} />
        <button onClick={async () => {
          if (shipmentToBeAdded.itemId !== 'na' && shipmentToBeAdded.quantity > 0) {
            let res = await axios.post('/api/shipment', {
              itemId: parseInt(shipmentToBeAdded.itemId),
              quantityToShip: shipmentToBeAdded.quantity
            })
            let newShipments = [...shipments, res.data.shipmentInfo];
            res.status === 200 && (() => {
              setShipments(newShipments);
              alert('reload page');
            })();
            res.status === 400 && alert('Shipping more inventory that available ("Stock Available")');
          }
        }}>Create shipment</button>
      </div> :
        <table className={styles.table}>
          <tr>
            <th>Shipment ID</th>
            <th>Item ID</th>
            <th>Quantity Shipped</th>
          </tr>
          {shipments.map(({ shipmentId, itemId, quantity }, idx) => (<tr key={idx}>
            <td>{shipmentId}</td>
            <td>{itemId}</td>
            <td>{quantity}</td>
          </tr>))}
        </table>
      }
    </div >
  )
}
