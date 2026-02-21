---
description: Quick Integration Guide for Product Management System
---

# Quick Integration Guide

## Using ProductContext in Components

### 1. Import the Hook

```javascript
import { useProduct } from '@/customer/context/ProductContext'
```

### 2. Access Products & Categories

```javascript
export default function ProductList() {
  const { products, categories } = useProduct()

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          {product.stock === 0 && <span>Out of Stock</span>}
        </div>
      ))}
    </div>
  )
}
```

### 3. Add/Update/Delete Products

```javascript
import { useProduct } from '@/customer/context/ProductContext'

export default function ProductForm() {
  const { addProduct, updateProduct, deleteProduct } = useProduct()

  const handleAdd = () => {
    const result = addProduct({
      name: 'Gold Ring',
      price: 15000,
      categoryId: 'cat-123',
      stock: 10
    })
    
    if (result.success) {
      console.log('Product added:', result.product)
    } else {
      console.error('Error:', result.error)
    }
  }

  const handleUpdate = (productId) => {
    const result = updateProduct(productId, { price: 12000 })
    if (result.success) {
      console.log('Updated:', result.product)
    }
  }

  const handleDelete = (productId) => {
    const result = deleteProduct(productId)
    if (result.success) {
      alert('Product deleted')
    }
  }

  return (
    <div>
      <button onClick={handleAdd}>Add Product</button>
      <button onClick={() => handleUpdate('prod-123')}>Update</button>
      <button onClick={() => handleDelete('prod-123')}>Delete</button>
    </div>
  )
}
```

## Stock Management

### 1. Check Stock

```javascript
const { checkInStock, checkLowStock } = useProduct()

// Check if in stock
if (checkInStock(productId)) {
  // Show add to cart button
}

// Check if low stock
if (checkLowStock(productId)) {
  // Show "Only X left!" warning
}
```

### 2. Decrease Stock on Order

```javascript
import { validateCartStock, processOrderAndDecrementStock } from '@/customer/utils/checkoutValidation'

export default function Checkout() {
  const productContext = useProduct()
  const { cartItems } = useCart()

  const handleCheckout = async () => {
    // Validate first
    const validation = validateCartStock(cartItems, productContext)
    if (!validation.valid) {
      alert('Error:\n' + validation.errors.join('\n'))
      return
    }

    // Process order
    const result = await processOrderAndDecrementStock(cartItems, productContext)
    if (result.success) {
      console.log('Order placed:', result.order.orderId)
      // Clear cart, show success
    } else {
      alert('Error: ' + result.error)
    }
  }

  return <button onClick={handleCheckout}>Place Order</button>
}
```

### 3. Manually Adjust Stock (Admin)

```javascript
export default function AdminInventory() {
  const { increaseStock, decreaseStock } = useProduct()

  const handleRestock = (productId, amount) => {
    const result = increaseStock(productId, amount)
    if (result.success) {
      console.log(`Stock increased to: ${result.product.stock}`)
    }
  }

  const handleSell = (productId, amount) => {
    const result = decreaseStock(productId, amount)
    if (!result.success) {
      console.error('Sell failed:', result.error)
    }
  }

  return (
    <div>
      <button onClick={() => handleRestock('prod-123', 5)}>Add 5 units</button>
      <button onClick={() => handleSell('prod-123', 1)}>Sell 1 unit</button>
    </div>
  )
}
```

## Category Management

### 1. Create Category

```javascript
export default function CategoryForm() {
  const { addCategory } = useProduct()
  const [name, setName] = useState('')

  const handleCreate = () => {
    const result = addCategory(name)
    if (result.success) {
      console.log('Category created:', result.category)
      setName('')
    } else {
      alert('Error: ' + result.error)
    }
  }

  return (
    <div>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)}
        placeholder="Category name"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}
```

### 2. Get Products in Category

```javascript
export default function CategoryProducts({ categoryId }) {
  const { getProductsInCategory } = useProduct()
  const products = getProductsInCategory(categoryId)

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}
```

### 3. Delete Category

```javascript
const handleDelete = (categoryId) => {
  const result = deleteCategory(categoryId)
  if (!result.success) {
    // Shows error like "Cannot delete category with 5 product(s)"
    alert('Error: ' + result.error)
  }
}
```

## Low Stock Alerts (Admin)

```javascript
import { getLowStockAlerts } from '@/customer/utils/checkoutValidation'

export default function AdminDashboard() {
  const productContext = useProduct()
  const alerts = getLowStockAlerts(productContext, 10) // warning level 10

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.productId}>
          <p>{alert.productName}</p>
          <p>Stock: {alert.currentStock}/{alert.threshold}</p>
          <p>Status: {alert.status}</p>
          <span style={{
            color: alert.severity === 'critical' ? 'red' : 
                   alert.severity === 'high' ? 'orange' : 'yellow'
          }}>
            {alert.severity}
          </span>
        </div>
      ))}
    </div>
  )
}
```

## Data Validation

### Validate Product Schema

```javascript
import { validateProductSchema } from '@/customer/models/productModels'

const product = {
  id: 'prod-123',
  name: 'Ring',
  price: 5000,
  categoryId: 'cat-456',
  stock: 10
}

const categories = [{ id: 'cat-456', name: 'Rings' }]

const validation = validateProductSchema(product, categories)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  // ["Category with ID 'cat-456' does not exist"]
}
```

### Validate Product Integrity

```javascript
import { validateProductIntegrity } from '@/customer/utils/checkoutValidation'

const validation = validateProductIntegrity(products)
if (!validation.valid) {
  console.warn('Data issues found:', validation.errors)
}
```

### Normalize Product Data

```javascript
import { normalizeProduct } from '@/customer/models/productModels'

const raw = {
  id: ' prod-123 ',
  name: ' Gold Ring ',
  price: '5000',
  stock: null
}

const clean = normalizeProduct(raw)
// {
//   id: 'prod-123',
//   name: 'Gold Ring',
//   price: 5000,
//   stock: 0,
//   ... other fields with defaults
// }
```

## Common Patterns

### 1. Product Gallery with Stock Status

```javascript
export default function ProductGallery() {
  const { products, checkInStock, getProductById } = useProduct()

  return (
    <div className="grid grid-cols-3">
      {products.map(product => (
        <div key={product.id} className="card">
          <img src={product.imageUrl} />
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          
          {checkInStock(product.id) ? (
            <button>Add to Cart</button>
          ) : (
            <button disabled>Out of Stock</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

### 2. Cart Validation Before Checkout

```javascript
export default function CartCheckout() {
  const { cartItems, totalPrice } = useCart()
  const productContext = useProduct()
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setError('')

    // Validate stock
    const { valid, errors } = validateCartStock(cartItems, productContext)
    if (!valid) {
      setError(errors.join('\n'))
      return
    }

    // Process order
    const result = await processOrderAndDecrementStock(cartItems, productContext)
    if (!result.success) {
      setError(result.error)
      return
    }

    // Success!
    console.log('Order placed:', result.order)
  }

  return (
    <div>
      <h3>Total: ₹{totalPrice}</h3>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  )
}
```

### 3. Admin Product Upload with Validation

```javascript
export default function AdminProductUpload() {
  const { addProduct, getAllCategories } = useProduct()
  const categories = getAllCategories()
  const [form, setForm] = useState({ name: '', price: '', categoryId: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = addProduct({
      ...form,
      price: Number(form.price),
      stock: 0
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    alert('Product added: ' + result.product.id)
    setForm({ name: '', price: '', categoryId: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Product name"
      />
      <input
        type="number"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
        placeholder="Price"
      />
      <select
        value={form.categoryId}
        onChange={e => setForm({ ...form, categoryId: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      {error && <p className="error">{error}</p>}
      <button type="submit">Add Product</button>
    </form>
  )
}
```

## Error Handling

All operations return objects with `success` flag and optional `error` message:

```javascript
// Success case
const result = addProduct(data)
if (result.success) {
  console.log('Created:', result.product)
} else {
  console.error('Failed:', result.error)
}

// Async operations
try {
  const result = await processOrderAndDecrementStock(cartItems, context)
  if (result.success) {
    // Handle order
  } else {
    // Show error: result.error
  }
} catch (err) {
  // Handle unexpected errors
  console.error('Unexpected error:', err)
}
```

## Best Practices

1. **Always check `result.success`** before accessing data
2. **Use meaningful product IDs** (auto-generated: `prod-timestamp-random`)
3. **Validate before checkout** to prevent order failures
4. **Show low stock warnings** to encourage faster purchases
5. **Handle category references** properly (can't delete if products assigned)
6. **Use try/catch** for async operations
7. **Log operations** with console for debugging
8. **Normalize data** before storing

## Troubleshooting

### "Product not found"
- Check if product ID is correct
- Ensure product was added with `addProduct()` first
- Verify ID format: `prod-...`

### "Category does not exist"
- Create category first with `addCategory()`
- Verify categoryId matches category.id exactly
- Use `getCategory(id)` to verify it exists

### "Insufficient stock"
- Check current stock with `checkInStock(id)`
- Verify cart quantities don't exceed available stock
- Use `getLowStockWarnings()` to see zero-stock products

### "Cannot delete category"
- Check products assigned to category
- Move products to different category first
- Or delete products individually

### Stock not decreasing
- Verify `decreaseStock()` returns `{ success: true }`
- Check localStorage in DevTools → Application → Storage
- Ensure `processOrderAndDecrementStock()` was called

---

**Questions?** Check `PRODUCT_SYSTEM_ARCHITECTURE.md` for detailed docs
