// // src/components/BulkUpload.js
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileUpload = () => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.name || !product.price || !product.quantity) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       let imageUrl = "";
//       if (product.image) {
//         try {
//           const response = await fetch(product.image);
//           const blob = await response.blob();
//           const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
//           await uploadBytes(imageRef, blob);
//           imageUrl = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("Error uploading image: ", error);
//           continue;
//         }
//       }

//       const productData = {
//         name: product.name.trim(),
//         price: parseFloat(product.price),
//         quantity: parseInt(product.quantity),
//         imageUrl: imageUrl
//       };

//       if (isNaN(productData.price) || isNaN(productData.quantity)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     setProducts([]);
//   };

//   return (
//     <div>
//       <h1>Bulk Upload Products</h1>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload Excel</button>
//       <button onClick={handleSubmit}>Submit to Firestore</button>
//     </div>
//   );
// };

// export default BulkUpload;
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);

//   // Handle file change for both CSV and Excel
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFile(file);
//   };

//   // Handle file upload and parsing
//   const handleFileUpload = () => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Handle form submission to Firestore
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.name || !product.price || !product.quantity) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       let imageUrl = "";
//       if (product.image) {
//         try {
//           const response = await fetch(product.image);
//           const blob = await response.blob();
//           const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
//           await uploadBytes(imageRef, blob);
//           imageUrl = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("Error uploading image: ", error);
//           continue;
//         }
//       }

//       const productData = {
//         name: product.name.trim(),
//         price: parseFloat(product.price),
//         quantity: parseInt(product.quantity),
//         imageUrl: imageUrl
//       };

//       if (isNaN(productData.price) || isNaN(productData.quantity)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     // Clear products state after submission
//     setProducts([]);
//   };

//   return (
//     <div>
//       <h1>Bulk Upload Products</h1>
//       <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload File</button>
//       <button onClick={handleSubmit}>Submit to Firestore</button>
//     </div>
//   );
// };

// export default BulkUpload;
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./BulkUpload.css"; // Import the CSS file

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);

//   // Handle file change for both CSV and Excel
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFile(file);
//   };

//   // Handle file upload and parsing
//   const handleFileUpload = () => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Handle form submission to Firestore
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.productcode || !product.name || !product.price || !product.quantity ) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       let imageUrl = "";
//       if (product.image) {
//         try {
//           const response = await fetch(product.image);
//           const blob = await response.blob();
//           const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
//           await uploadBytes(imageRef, blob);
//           imageUrl = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("Error uploading image: ", error);
//           continue;
//         }
//       }

//       const productData = {
//         productcode:product.productcode,
//         name: product.name.trim(),
//         price: parseFloat(product.price),
//         quantity: parseInt(product.quantity),
//         imageUrl: imageUrl
//       };

//       if (isNaN(productData.price) || isNaN(productData.quantity)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     // Clear products state after submission
//     setProducts([]);
//   };

//   return (
//     <div className="container">
//       <h1 className="header">Bulk Upload Products</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="fileUpload">Upload File:</label>
//           <input
//             id="fileUpload"
//             type="file"
//             accept=".csv, .xlsx, .xls"
//             onChange={handleFileChange}
//           />
//         </div>
//         <div className="buttons">
//           <button type="button" onClick={handleFileUpload}>
//             Upload File
//           </button>
//           <button type="submit">Submit to Firestore</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BulkUpload;
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./BulkUpload.css"; // Import the CSS file

const BulkUpload = () => {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
  };

  const handleFileUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setProducts(worksheet);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productCollection = collection(db, "products");

    for (const product of products) {
      if (!product.name || !product.price || !product.quantity) {
        console.error("Missing field(s) in product: ", product);
        continue;
      }

      let imageUrl = "";
      if (product.image) {
        try {
          const response = await fetch(product.image);
          const blob = await response.blob();
          const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
          const uploadTask = uploadBytesResumable(imageRef, blob);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Error uploading image: ", error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }
          );

          await uploadTask;
        } catch (error) {
          console.error("Error uploading image: ", error);
          continue;
        }
      }

      const productData = {
        name: product.name.trim(),
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        imageUrl: imageUrl
      };

      if (isNaN(productData.price) || isNaN(productData.quantity)) {
        console.error("Invalid price or quantity for product:", product);
        continue;
      }

      try {
        await addDoc(productCollection, productData);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }

    setProducts([]);
    setFileName("");
    setUploadProgress(0);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    setFile(file);
    setFileName(file.name);
  };

  return (
    <div className="container">
      <h1 className="header">Bulk Upload Products</h1>
      <form onSubmit={handleSubmit}>
        <div
          className={`file-drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="fileUpload" className="file-label">
            Drag and drop a file here, or click to select a file
          </label>
          <input
            id="fileUpload"
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {fileName && <p className="file-name">{fileName}</p>}
        </div><br></br>
        <div className="buttons">
          <button className="btn" type="button" onClick={handleFileUpload}>
            Upload File
          </button>
          <button className="btn" type="submit">Submit to Firestore</button>
        </div>
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BulkUpload;