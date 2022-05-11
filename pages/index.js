import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/index.module.css';
import axios from 'axios';

export default function App() {
  let [inventory, setInventory] = useState([]);

  const createInventoryItem = async () => {
    let newInventory = [...inventory, {
      itemId: null,
      name: "",
      stockAvailable: 0,
      stockOnHand: 0,
      stockHolding: 0,
      stockIncoming: 0
    }];

    setInventory(newInventory);
  };

  const createDummyInventoryItem = async () => {
    saveCreatedInventoryItem({
      itemId: Math.floor(Math.random() * 90000) + 10000,
      name: `Product ${(Math.random() + 1).toString(36).substring(5)}`,
      stockAvailable: Math.floor(Math.random() * 100),
      stockOnHand: Math.floor(Math.random() * 100),
      stockHolding: Math.floor(Math.random() * 100),
      stockIncoming: Math.floor(Math.random() * 100)
    });
  }

  const saveCreatedInventoryItem = async (newCellData) => {
    let newInventory = [...inventory, newCellData];

    let res = await axios.post('/api/inventory', {
      newCellData: newCellData
    });

    res.status === 200 && setInventory(newInventory);
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
          <input placeholder='Input a number' type='number' value={cellData.stockOnHand} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockOnHand: parseInt(e.target.value)
            };
          })} />
        </td>
        <td>
          <input placeholder='Input a number' type='number' value={cellData.stockHolding} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockHolding: parseInt(e.target.value)
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
          <td>{cellData.stockOnHand}</td>
          <td>{cellData.stockHolding}</td>
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
  }, [])

  useEffect(() => {
    console.log("Inventory changed", inventory);
  }, [inventory])

  return (
    <div style={{ display: "flex" }}>
      <Head>
        <title>Inventory Management</title>
      </Head>
      <div>
        <button onClick={createInventoryItem}>Create New Inventory Item</button>
        <button onClick={createDummyInventoryItem}>Create Dummy Inventory Item</button>
      </div>
      <table className={styles.table}>
        <tr>
          <th>Item ID</th>
          <th>Name</th>
          <th>Stock Available</th>
          <th>Stock On Hand</th>
          <th>Stock Holding</th>
          <th>Stock Incoming</th>
          <th>Actions</th>
        </tr>
        {inventory.map((data, idx) => <InventoryCell key={idx} idx={idx} data={data} />)}
      </table>
    </div >
  )
}
