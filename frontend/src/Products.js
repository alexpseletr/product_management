import React, { useState, useEffect } from 'react';

const Products = ({ authToken }) => {
  const [products, setProducts] = useState([]);
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      setGroup(data.group);
    } catch (error) {
      console.error(error);
      setProducts([]);
      setGroup([]);
    }
  };

  const handleEditProduct = async (productId, newName, newPrice) => {
    try {
      if (!newName || !newPrice) {
        console.error('Name and price cannot be empty');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: newName, price: newPrice })
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const isAdmin = group && group === 'admin';
  
  function ProductCard({ product, isAdmin }) {
    const [newName, setNewName] = useState(product.name);
    const [newPrice, setNewPrice] = useState(product.price);

    const handleChangeName = (e) => {
      setNewName(e.target.value);
    };

    const handleChangePrice = (e) => {
      setNewPrice(e.target.value);
    };

    const handleSave = () => {
      handleEditProduct(product.id, newName, newPrice);
    };

    return (
      <div className="product-card">
        <p>Product: {isAdmin ? <input type="text" value={newName} onChange={handleChangeName} /> : product.name}</p>
        <p>Price: {isAdmin ? <input type="number" value={newPrice} onChange={handleChangePrice} /> : product.price}</p>
        {isAdmin && <button onClick={handleSave}>Save</button>}
      </div>
    );
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="products-container">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
    </div>
  );
};

export default Products;
