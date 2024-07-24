// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     items: [],
//     totalAmount: 0,
//     discountPercentage: 0,
//     discountedTotal: 0,
//     taxPercentage: 0,
//     grandTotal: 0,
//   });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//         initializeBillingDetails(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const initializeBillingDetails = (fetchedProducts) => {
//     const initialItems = fetchedProducts.map(product => ({
//       productId: product.id,
//       name: product.name,
//       quantity: 0,
//       price: product.price,
//     }));
//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: initialItems,
//     }));
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedItems = billingDetails.items.map(item =>
//       item.productId === productId ? { ...item, quantity } : item
//     );
//     updateBillingDetails(updatedItems);
//   };

//   const updateBillingDetails = (updatedItems) => {
//     const totalAmount = updatedItems.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = billingDetails.discountPercentage;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     const taxPercentage = billingDetails.taxPercentage;
//     const taxAmount = discountedTotal * (taxPercentage / 100);

//     const grandTotal = discountedTotal + taxAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: updatedItems,
//       totalAmount,
//       discountedTotal,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   const handleTaxChange = (event) => {
//     const taxPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       taxPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(billingDetails.items);
//   }, [billingDetails.discountPercentage, billingDetails.taxPercentage]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, billingDetails);
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // Add Header
//     doc.setFontSize(18);
//     doc.text('Company Name', 10, 10);
//     doc.setFontSize(12);
//     doc.text('Company Address', 10, 20);
//     doc.text('Contact: 123-456-7890', 10, 30);
    
//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 10);

//     // Add Table Headers
//     doc.setFontSize(14);
//     doc.text('Item', 10, 50);
//     doc.text('Quantity', 70, 50);
//     doc.text('Price', 120, 50);
//     doc.text('Total', 170, 50);
    
//     // Add Table Rows
//     const filteredItems = billingDetails.items.filter(item => item.quantity > 0);
//     filteredItems.forEach((item, index) => {
//       const y = 60 + index * 10;
//       doc.text(item.name, 10, y);
//       doc.text(item.quantity.toString(), 70, y);
//       doc.text(`₹${item.price.toFixed(2)}`, 120, y);
//       doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 170, y);
//     });

//     // Add Summary
//     const summaryStartY = 70 + filteredItems.length * 10;
//     doc.text(`Total Amount: ₹${billingDetails.totalAmount.toFixed(2)}`, 10, summaryStartY);
//     doc.text(`Discount: ${billingDetails.discountPercentage}%`, 10, summaryStartY + 10);
//     doc.text(`Discounted Total: ₹${billingDetails.discountedTotal.toFixed(2)}`, 10, summaryStartY + 20);
//     doc.text(`Tax: ${billingDetails.taxPercentage}%`, 10, summaryStartY + 30);
//     doc.text(`Tax Amount: ₹${((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}`, 10, summaryStartY + 40);
//     doc.text(`Grand Total: ₹${billingDetails.grandTotal.toFixed(2)}`, 10, summaryStartY + 50);

//     // Add Footer
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, 290);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, 300);

//     doc.save('billing_details.pdf');
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <ul className="billing-list">
//           {products.map(product => (
//             <li key={product.id}>
//               {product.name} - ₹{product.price.toFixed(2)} per unit
//               <input
//                 type="number"
//                 min="0"
//                 value={billingDetails.items.find(item => item.productId === product.id)?.quantity || 0}
//                 onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
//               />
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-details">
//           <label>Tax Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.taxPercentage}
//             onChange={handleTaxChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>Tax Amount: ₹{((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],  
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       didDrawCell: (data) => {
//         // Draw underline and break line for the Grand Total row
//         if (data.row.index === tableBody.length - 1 && data.column.index === 3) {
//           const doc = data.doc;
//           const cell = data.cell;
//           const textPos = cell.textPos;
//           doc.setDrawColor(0);
//           doc.setLineWidth(0.5);
//           doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // underline
//           doc.text(' ', cell.x + cell.width, cell.y + cell.height + 10); // break line
//         }
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="customer-name">
//           <label>Customer Name:</label>
//           <input
//             type="text"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//           <label>Customer State:</label>
//           <input
//             type="text"
//             value={customerState}
//             onChange={(e) => setCustomerState(e.target.value)}
//           />
//         </div>
//         <ul className="product-list">
//           {searchTerm && filteredProducts.map(product => (
//             <li key={product.id} onClick={() => handleAddToCart(product)}>
//               {product.name} - ₹{product.price.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <ul className="cart-list">
//           {cart.map(item => (
//             <li key={item.productId}>
//               {item.name} - ₹{item.price.toFixed(2)} x 
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//               />
//               = ₹{(item.price * item.quantity).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//           <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//           <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;



// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
     
//     } else {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//       },
//       bodyStyles: {
//         fillColor: [255, 255, 255],
//       },
//       alternateRowStyles: {
//         fillColor: [240, 240, 240],
//       },
//       tableLineWidth: 0.1,
//       tableLineColor: [0, 0, 0],
//       didDrawCell: (data) => {
//         // Draw underline and break line for the Grand Total row
//         if (data.row.index === tableBody.length - 1 && data.column.index === 3) {
//           const doc = data.doc;
//           const cell = data.cell;
//           const textPos = cell.textPos;
//           doc.setDrawColor(0);
//           doc.setLineWidth(0.5);
//           doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // underline
//           doc.text(' ', cell.x + cell.width, cell.y + cell.height + 10); // break line
//         }
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="customer-name">
//           <label>Customer Name:</label>
//           <input
//             type="text"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//           <label>Customer State:</label>
//           <input
//             type="text"
//             value={customerState}
//             onChange={(e) => setCustomerState(e.target.value)}
//           />
//         </div>
//         <ul className="product-list">
//           {searchTerm && filteredProducts.map(product => (
//             <li key={product.id} onClick={() => handleAddToCart(product)}>
//               {product.name} - ₹{product.price.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <ul className="cart-list">
//           {cart.map(item => (
//             <li key={item.productId}>
//               {item.name} - ₹{item.price.toFixed(2)} x 
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//               />
//               = ₹{(item.price * item.quantity).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//           <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//           <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 255] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' } }
//       ]
//     );

//     doc.autoTable({
//       head: [['Item Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       startY: 40,
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = products.filter(product => 
//       product.name.toLowerCase().includes(value)
//     );
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const existingItem = cart.find(item => item.productId === product.id);
//     if (existingItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//     } else {
//       setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h3>Search Products</h3>
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//           <ul className="product-list">
//             {filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - Rs. {product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <h3>Cart</h3>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - Rs. {item.price.toFixed(2)}
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//               </li>
//             ))}
//           </ul>
//           <div className="customer-name">
//             <label>Customer Name:</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//           </div>
//           <div className="customer-name">
//             <label>Customer State:</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//           </div>
//           <div className="discount-input">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//           </div>
//           <div className="billing-summary">
//             <h3>Billing Summary</h3>
//             <p>Total Amount: Rs. {billingDetails.totalAmount.toFixed(2)}</p>
//             <p>Discounted Total: Rs. {billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): Rs. {billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): Rs. {billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): Rs. {billingDetails.igstAmount.toFixed(2)}</p>
//             <h3>Grand Total: Rs. {billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save & Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         lineWidth: 0.5,
//         lineColor: [0, 0, 0]
//       },
//       theme: 'plain',
//       didDrawPage: (data) => {
//         // Add logo/image here if needed
//         doc.setFontSize(10);
//         doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//       }
//     });

//     doc.save(`invoice_${customerName}_${new Date().getTime()}.pdf`);
//   };

//   const handleSearch = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     if (searchTerm.trim() !== '') {
//       const filteredProducts = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm)
//       );
//       setFilteredProducts(filteredProducts);
//     } else {
//       setFilteredProducts([]);
//     }
//   };

//   const handleAddToCart = (product) => {
//     const existingItem = cart.find(item => item.productId === product.id);
//     if (existingItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//           <ul className={`product-list ${searchTerm !== '' ? '' : 'hidden'}`}>
//             {searchTerm !== '' ? (
//               filteredProducts.map(product => (
//                 <li key={product.id} onClick={() => handleAddToCart(product)}>
//                   {product.name} - Rs. {product.price.toFixed(2)}
//                 </li>
//               ))
//             ) : (
//               products.map(product => (
//                 <li key={product.id} onClick={() => handleAddToCart(product)}>
//                   {product.name} - Rs. {product.price.toFixed(2)}
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//         <div className="right-panel">
//           {/* Display the cart items and billing details here */}
//           <h2>Cart</h2>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - Qty: <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//               </li>
//             ))}
//           </ul>
//           <div className="billing-summary">
//             <h3>Billing Summary</h3>
//             <p>Total Amount: Rs. {billingDetails.totalAmount.toFixed(2)}</p>
//             <p>Discount Percentage:
//               <input
//                 type="number"
//                 value={billingDetails.discountPercentage}
//                 onChange={handleDiscountChange}
//               />
//             </p>
//             <p>Discounted Total: Rs. {billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): Rs. {billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): Rs. {billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): Rs. {billingDetails.igstAmount.toFixed(2)}</p>
//             <p>Grand Total: Rs. {billingDetails.grandTotal.toFixed(2)}</p>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save Invoice</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
      
//     } else {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}     Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );
//     doc.autoTable({
//             startY: 50, // Adjust starting Y position to leave space for logo and header
//             head: [['Item', 'Quantity', 'Price', 'Total']],
//             body: tableBody,
//             styles: {
//               lineColor: [0, 0, 0],
//               lineWidth: 0.1,
//               font: "helvetica",
//               fontSize: 10,
//               cellPadding: 3,
//               textColor: [0, 0, 0],
//             },
//             headStyles: {
//               fillColor: [200, 200, 200],
//               textColor: [0, 0, 0],
//               fontStyle: 'bold',
//               lineWidth: 0.5,
//               lineColor: [0, 0, 0]
//             },
//             theme: 'plain',
//             didDrawPage: (data) => {
//               // Add logo/image here if needed
//               doc.setFontSize(10);
//               doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//             }
//           });
      
//     // Add Table
   

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h2>Billing Calculator</h2>
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <ul className="product-list">
//             {searchTerm && filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - ₹{product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <div className="customer-details">
//             <div className="customer-input">
//               <label>Customer Name:</label>
//               <input
//                 type="text"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//               />
//             </div>
//             <div className="customer-input">
//               <label>Customer State:</label>
//               <input
//                 type="text"
//                 value={customerState}
//                 onChange={(e) => setCustomerState(e.target.value)}
//               />
//             </div>
//           </div>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - ₹{item.price.toFixed(2)} x 
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 = ₹{(item.price * item.quantity).toFixed(2)}
//               </li>
//             ))}
//           </ul>
//           <div className="billing-details">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//             %
//           </div>
//           <div className="billing-summary">
//             <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//             <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//             <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst'); // Default tax option

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//         // igstAmount = discountedTotal * 0.18;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
//     const imgData=
//     doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}`,150,24);     
//     doc.text(`Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         lineWidth: 0.5,
//         lineColor: [0, 0, 0]
//       },
//       theme: 'plain',
//       didDrawPage: (data) => {
//         // Add logo/image here if needed
//         doc.setFontSize(10);
//         doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   const handleTaxOptionChange = (event) => {
//     setTaxOption(event.target.value);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h2>Billing Calculator</h2>
//           <div className="search-bar">
//             <input
//             className="search-input"
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <ul className="product-list">
//             {searchTerm && filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - ₹{product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <div className="customer-details">
//             <div className="customer-input">
//               <label>Customer Name:</label>
//               <input
//                 type="text"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 required 
//               />
//             </div>
//             <div className="customer-input">
//               <label>Customer State:</label>
//               <input
//                 type="text"
//                 value={customerState}
//                 onChange={(e) => setCustomerState(e.target.value)}
//               />
//             </div>
//             <div className="tax-options">
//               <input
//                 type="radio"
//                 id="cgst_sgst"
//                 name="taxOption"
//                 value="cgst_sgst"
//                 checked={taxOption === 'cgst_sgst'}
//                 onChange={handleTaxOptionChange}
//               />
//               <label htmlFor="cgst_sgst">CGST + SGST (9% each)</label>
//               <br />
//               <input
//                 type="radio"
//                 id="igst"
//                 name="taxOption"
//                 value="igst"
//                 checked={taxOption === 'igst'}
//                 onChange={handleTaxOptionChange}
//               />
//               <label htmlFor="igst">IGST (18%)</label>
//             </div>
//           </div>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - ₹{item.price.toFixed(2)} x
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 = ₹{(item.price * item.quantity).toFixed(2)}
//               </li>
//             ))}
//           </ul>
//           <div className="billing-details">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//             %
//           </div>
//           <div className="billing-summary">
//             <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//             <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//             {taxOption === 'cgst_sgst' && (
//               <>
//                 <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//                 <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//               </>
//             )}
//             {taxOption === 'igst' && (
//               <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//             )}
//             <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;


// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst'); // Default tax option

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//         // igstAmount = discountedTotal * 0.18;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}     Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Product Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       theme: 'grid',
//       styles: {
//         halign: 'center',
//         valign: 'middle',
//         fontStyle: 'normal',
//         fontSize: 10,
//         cellPadding: 4,
//         overflow: 'linebreak'
//       },
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 50 }
//       },
//       margin: { top: 10, right: 10, bottom: 10, left: 10 }
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     const filteredProducts = products.filter(product =>
//       product.name.toLowerCase().includes(event.target.value.toLowerCase())
//     );
//     setFilteredProducts(filteredProducts);
//   };

//   const handleAddToCart = (product) => {
//     const cartItem = cart.find(item => item.productId === product.id);
//     if (cartItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-calculator">
//       <div className="product-list">
//         <input
//           type="text"
//           placeholder="Search Products"
//           value={searchTerm}
//           onChange={handleSearch}
//           className="search-input"
//         />
//         <ul>
//           {filteredProducts.map(product => (
//             <li key={product.id}>
//               <div className="product-details">
//                 <span>{product.name}</span>
//                 <span>Rs. {product.price.toFixed(2)}</span>
//               </div>
//               <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="cart">
//         <h2>Cart</h2>
//         <ul>
//           {cart.map(item => (
//             <li key={item.productId}>
//               <div className="cart-item">
//                 <span>{item.name}</span>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="billing-summary">
//           <div className="billing-details">
//             <label>Discount (%)</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//               min="0"
//               max="100"
//             />
//             <label>Customer Name</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <label>Customer State</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//             <label>Tax Option</label>
//             <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
//               <option value="cgst_sgst">CGST + SGST</option>
//               <option value="igst">IGST</option>            
//               <option value="no_tax">No Tax</option>
//             </select>
//           </div>
//           <div className="billing-amounts">
//             <table>
//               <tbody>
//                 <tr>
//                   <td>Total Amount:</td>
//                   <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Discounted Total:</td>
//                   <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
//                 </tr>
//                 {taxOption === 'cgst_sgst' && (
//                   <>
//                     <tr>
//                       <td>CGST (9%):</td>
//                       <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td>SGST (9%):</td>
//                       <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
//                     </tr>
//                   </>
//                 )}
//                 {taxOption === 'igst' && (
//                   <tr>
//                     <td>IGST (18%):</td>
//                     <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
//                   </tr>
//                 )}
//                 <tr className="grand-total-row">
//                   <td>Grand Total:</td>
//                   <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState('');
//   const [businessState, setBusinessState] = useState('YourBusinessState');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst');
//   const [currentDate, setCurrentDate] = useState(new Date()); // State for current date

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () =>  {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(currentDate) // Use the selected date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();

//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20);
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State
//     doc.text(`Customer Name: ${customerName}`,150,28  );  
//     doc.text( `Customer State: ${customerState}`, 150, 38);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Product Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       theme: 'grid',
//       styles: {
//         halign: 'center',
//         valign: 'middle',
//         fontStyle: 'normal',
//         fontSize: 10,
//         cellPadding: 4,
//         overflow: 'linebreak'
//       },
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 50 }
//       },
//       headStyles: {
//         fillColor: [211, 211, 211], // Light gray background for header
//         textColor: [0, 0, 0], // Black text color
//         fontStyle: 'bold', // Bold font style for header text
//         halign: 'center', // Center-aligned header text
//         lineWidth: 0.5, // Thin border for header
//         lineColor: [0, 0, 0] // Black border color
//       },
//       margin: { top: 10, right: 10, bottom: 10, left: 10 }
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     const filteredProducts = products.filter(product =>
//       product.name.toLowerCase().includes(event.target.value.toLowerCase())
//     );
//     setFilteredProducts(filteredProducts);
//   };

//   const handleAddToCart = (product) => {
//     const cartItem = cart.find(item => item.productId === product.id);
//     if (cartItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-calculator">
//       <div className="product-list">
//         <input
//           type="text"
//           placeholder="Search Products"
//           value={searchTerm}
//           onChange={handleSearch}
//           className="search-input"
//         />
//         <ul>
//           {filteredProducts.map(product => (
//             <li key={product.id}>
//               <div className="product-details">
//                 <span>{product.name}</span>
//                 <span>Rs. {product.price.toFixed(2)}</span>
//               </div>
//               <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="cart">
//         <h2>Cart</h2>
//         <ul>
//           {cart.map(item => (
//             <li key={item.productId}>
//               <div className="cart-item">
//                 <span>{item.name}</span>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="billing-summary">
//           <div className="billing-details">
//             <label>Discount (%)</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//               min="0"
//               max="100"
//             />
//             <label>Customer Name</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <label>Customer State</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//             <label>Date</label>
//             <input
//               type="date"
//              className="custom-datepicker"
//               value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
//               onChange={(e) => setCurrentDate(new Date(e.target.value))}
//             />
//             <label>Tax Option</label>
//             <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
//               <option value="cgst_sgst">CGST + SGST</option>
//               <option value="igst">IGST</option>            
//               <option value="no_tax">No Tax</option>
//             </select>
//           </div>
//           <div className="billing-amounts">
//             <table>
//               <tbody>
//                 <tr>
//                   <td>Total Amount:</td>
//                   <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Discounted Total:</td>
//                   <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
//                 </tr>
//                 {taxOption === 'cgst_sgst' && (
//                   <>
//                     <tr>
//                       <td>CGST (9%):</td>
//                       <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td>SGST (9%):</td>
//                       <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
//                     </tr>
//                   </>
//                 )}
//                 {taxOption === 'igst' && (
//                   <tr>
//                     <td>IGST (18%):</td>
//                     <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
//                   </tr>
//                 )}
//                 <tr className="grand-total-row">
//                   <td>Grand Total:</td>
//                   <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the initialized firebase instance
import { collection, getDocs, addDoc, Timestamp, getDoc, doc as firestoreDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './BillingCalculator.css'; // Import the CSS file

const BillingCalculator = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    totalAmount: 0,
    discountPercentage: '',
    discountedTotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grandTotal: 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [businessState, setBusinessState] = useState('YourBusinessState');
  const [searchTerm, setSearchTerm] = useState('');
  const [taxOption, setTaxOption] = useState('cgst_sgst');
  const [currentDate, setCurrentDate] = useState(new Date()); // State for current date
  const [showCustomerDetails, setShowCustomerDetails] = useState(false); // State for toggling customer details
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(productsCollectionRef);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);


  const handleQuantityChange = (productId, quantity) => {
        const updatedCart = cart.map(item =>
          item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
        );
        setCart(updatedCart);
        updateBillingDetails(updatedCart);
      };

  const updateBillingDetails = (updatedCart) => {
    const totalAmount = updatedCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
    const discountedTotal = totalAmount * (1 - discountPercentage / 100);

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (taxOption === 'cgst_sgst') {
      if (customerState === businessState) {
        
      } else {
        cgstAmount = discountedTotal * 0.09;
        sgstAmount = discountedTotal * 0.09;
      }
    } else if (taxOption === 'igst') {
      igstAmount = discountedTotal * 0.18;
    }

    const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

    setBillingDetails(prevState => ({
      ...prevState,
      totalAmount,
      discountedTotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
    }));
  };

  const handleDiscountChange = (event) => {
    const discountPercentage = event.target.value;
    setBillingDetails(prevState => ({
      ...prevState,
      discountPercentage,
    }));
  };
  useEffect(() => {
    updateBillingDetails(cart);
  }, [billingDetails.discountPercentage, customerState, taxOption]);

  const generateRandomInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number
  };

  useEffect(() => {
    updateBillingDetails(cart);
  }, [billingDetails.discountPercentage, customerState, taxOption]);

  const handleSave = async () => {
   
  
    // Save billing details
    const invoiceNumber = generateRandomInvoiceNumber();
    const billingDocRef = collection(db, 'billing');
    try {
      await addDoc(billingDocRef, {
        ...billingDetails,
        customerName,
        customerState,
        customerPhone,
        customerEmail,
        date: Timestamp.fromDate(currentDate),
        productsDetails: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        createdAt: Timestamp.now(),
        invoiceNumber,
      });
      console.log('Billing details saved successfully in Firestore');
    } catch (error) {
      console.error('Error saving billing details: ', error);
    }
  window.location.reload();
    // Generate and save PDF invoice
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border
    const imgData='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'

     doc.addImage(imgData, 'JPEG', 14, 21, 25, 25);
    doc.setFontSize(14);
    doc.text('Tamizha Software solutions', 40, 28);
    doc.setFontSize(10);
    doc.text('Thiruthangal', 40, 35);
    doc.text('Contact: 123-456-7890', 40, 42);
    doc.text(`Invoice Number: ${invoiceNumber}`, 40, 50);
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, 130, 23);
    doc.text(`Customer Name: ${customerName}`, 131, 32);
    doc.text(`Customer State: ${customerState}`, 131, 40);
    doc.text(`Customer Phone: ${customerPhone}`, 131, 50);
    doc.text(`Customer Email: ${customerEmail}`, 131, 60);
    doc.rect(14, 15, 182, 50);
  
    // Prepare Table Body
    const tableBody = cart
      .filter(item => item.quantity > 0)
      .map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`
      ]);
  
    // Add Summary Rows
    tableBody.push(
      [
        { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ]
    );
  
    if (taxOption === 'cgst_sgst') {
      tableBody.push(
        [
          { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ],
        [
          { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    } else if (taxOption === 'igst') {
      tableBody.push(
        [
          { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    }
  
    tableBody.push(
      [
        { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ]
    );
  
    // Add Table with Reduced Border Thickness
    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Total']],
      body: tableBody,
      startY: 70,
      theme: 'grid',
      headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
  
    doc.save(`invoice_${invoiceNumber}.pdf`);
  };
  

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    setFilteredProducts(
      products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const productCode = product.productcode ? product.productcode.toLowerCase() : '';
        
        return productName.includes(term) || productCode.includes(term);
      })
    );
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setCurrentDate(selectedDate);
  };

  return (
    <div className="billing-calculator">
      
    <div className="product-list">
      <input
        type="text"
        placeholder="Search Products"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <div className="product-details">
              <span>{product.name}</span>
              <span>Rs. {product.price.toFixed(2)}</span>
            </div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
    <div className="cart">
      <h2>Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.productId}>
            <div className="cart-item">
              <span>{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
              />
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="billing-summary">
        <div className="billing-details">
          <label>Discount (%)</label>
          <input
            type="number"
            value={billingDetails.discountPercentage}
            onChange={handleDiscountChange}
            min="0"
            max="100"
          />
          {/* <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <label>Customer State</label>
          <input
            type="text"
            value={customerState}
            onChange={(e) => setCustomerState(e.target.value)}
          />
          <label>Customer Phone No</label>
          <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
        <label>Customer Email</label>
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        /> */}
          <label>Date</label>
          <input
            type="date"
           className="custom-datepicker"
            value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
          /><br></br><br></br>
          <label>Tax Option</label>
          <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
            <option value="cgst_sgst">CGST + SGST</option>
            <option value="igst">IGST</option>            
            <option value="no_tax">No Tax</option>
          </select>
        </div>
        <div className="billing-amounts">
          <table>
            <tbody>
              <tr>
                <td>Total Amount:</td>
                <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Discounted Total:</td>
                <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
              </tr>
              {taxOption === 'cgst_sgst' && (
                <>
                  <tr>
                    <td>CGST (9%):</td>
                    <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>SGST (9%):</td>
                    <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {taxOption === 'igst' && (
                <tr>
                  <td>IGST (18%):</td>
                  <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="grand-total-row">
                <td>Grand Total:</td>
                <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="customer-details">
        <button onClick={() => setShowCustomerDetails(!showCustomerDetails)}>
          {showCustomerDetails ? 'Hide Customer Details' : 'Customer Details'}
        </button>
        {showCustomerDetails && (
          <>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer State"
              value={customerState}
              onChange={(e) => setCustomerState(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </>
        )}
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  </div>
  );
};

export default BillingCalculator;
