import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/index.module.css';
import axios from 'axios';

export default function App() {
  const [inventory, setInventory] = useState([]);

  const Button = ({ children, link }) => {
    return (
      <a style={{ padding: "10px", margin: "10px", backgroundColor: "#eee", border: "1px #000000 solid" }} href={link}>
        {children}
      </a>
    );
  }

  const InventoryCell = ({ data }) => {

    const [cellData, setCellData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
      setCellData(data);
    }, []);

    return (
      isEditMode ? (<tr className={styles.inventoryCell} >
        <td>
          <input value={cellData.itemId} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              itemId: e.target.value
            };
          })} />
        </td>
        <td>
          <input value={cellData.name} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              name: e.target.value
            };
          })} />
        </td>
        <td>
          <input value={cellData.stockAvailable} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockAvailable: e.target.value
            };
          })} />
        </td>
        <td>
          <input value={cellData.stockOnHand} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockOnHand: e.target.value
            };
          })} />
        </td>
        <td>
          <input value={cellData.stockHolding} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockHolding: e.target.value
            };
          })} />
        </td>
        <td>
          <input value={cellData.stockIncoming} onChange={(e) => setCellData(cd => {
            return {
              ...cd,
              stockIncoming: e.target.value
            };
          })} />
        </td>
        <td>
          <button onClick={() => setIsEditMode(false)}>Save</button>
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
            <button>Delete</button>
          </td>
        </tr>)
    );
  }

  useEffect(() => {
    axios.get('/api/inventory')
      .then(res => res.data)
      .then(data => setInventory(data.inventory));
  }, [])

  return (
    <div style={{ display: "flex" }}>
      <Head>
        <title>Inventory Management</title>
      </Head>
      <button>Create Inventory Item</button>
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
        {inventory.map((data, idx) => <InventoryCell key={idx} data={data} />)}
      </table>
    </div >
  )
}
