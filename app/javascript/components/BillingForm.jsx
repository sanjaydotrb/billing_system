import React, { useEffect, useState } from "react";

const defaultDenominations = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export default function BillingForm() {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([{ product_id: "", quantity: 1 }]);
  const [denominations, setDenominations] = useState({});
  const [amountPaid, setAmountPaid] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

  useEffect(() => {
    fetch("/api/billings/products")
      .then((res) => res.json())
      .then((data) => setProductOptions(data))
      .catch((err) => console.error("Failed to fetch products", err));
    fetch("/api/billings/denominations")
      .then((res) => res.json())
      .then((data) => {
        const initialDenominations = {};
        data.forEach((denom) => {
          initialDenominations[denom.value] = denom.count || 0;
        });
        setDenominations(initialDenominations);
      })
  }, []);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { product_id: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      products,
      denominations,
      amount_paid: parseFloat(amountPaid),
    };

    try {
      const response = await fetch("/api/billings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert("Bill generated and emailed successfully!");
      console.log(data);
    } catch (error) {
      console.error("Billing error:", error);
      alert("Error generating bill.");
    }
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "8px",
    margin: "5px 0",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "4px",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>🧾 Generate Bill</h2>
      <form onSubmit={handleSubmit}>
        <div style={sectionStyle}>
          <label style={labelStyle}>Customer Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="e.g. customer@example.com"
          />
        </div>

        <div style={sectionStyle}>
          <h4>🛒 Products Purchased</h4>
          {products.map((product, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select
                value={product.product_id}
                onChange={(e) =>
                  handleProductChange(index, "product_id", e.target.value)
                }
                required
                style={{ ...inputStyle, flex: 2 }}
              >
                <option value="">Select Product</option>
                {productOptions.map((opt) => (
                  <option key={opt.id || opt.product_id} value={opt.product_id}>
                    {opt.name ? `${opt.name} (${opt.product_id})` : opt.product_id}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                required
                value={product.quantity}
                min="1"
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          ))}
          <button type="button" onClick={addProductRow} style={{ ...buttonStyle, backgroundColor: "#007bff" }}>
            + Add New Product
          </button>
        </div>

        <div style={sectionStyle}>
          <h4>💵 Denominations</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {defaultDenominations.map((value) => (
              <div key={value}>
                <label style={labelStyle}>₹{value}</label>
                <input
                  type="number"
                  min="0"
                  style={{ width: "60px", ...inputStyle }}
                  readOnly 
                  value={denominations[value] || 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Total Amount Paid (₹)</label>
          <input
            type="number"
            min="0"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>✅ Generate Bill</button>
      </form>
    </div>
  );
}
