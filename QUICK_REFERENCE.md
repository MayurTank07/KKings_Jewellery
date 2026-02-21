---
title: Product Management System - Quick Reference
width: "100%"
---

# Product Management System - Quick Reference 📋

## Import Statements

```javascript
// Core
import { useProduct } from '@/customer/context/ProductContext'
import { useCart } from '@/customer/context/useCart'

// Utilities
import { validateCartStock, processOrderAndDecrementStock, getLowStockAlerts } from '@/customer/utils/checkoutValidation'
import { validateProductSchema, normalizeProduct, isProductAvailable } from '@/customer/models/productModels'
```

## ProductContext API

### Read Data
```javascript
const { products, categories } = useProduct()
const product = getProductById('prod-123')
const category = getCategory('cat-456')
const categoryProducts = getProductsInCategory('cat-456')
```

### Add/Update/Delete
```javascript
const result = addProduct(productData)           // { success, error?, product? }
const result = updateProduct(id, updates)       // { success, error?, product? }
const result = deleteProduct(id)                // { success, error? }

const result = addCategory(name)                // { success, error?, category? }
const result = updateCategory(id, newName)      // { success, error?, category? }
const result = deleteCategory(id)               // { success, error? }
```

### Stock Management
```javascript
const result = increaseStock(productId, amount) // { success, error? }
const result = decreaseStock(productId, amount) // { success, error? }
const inStock = checkInStock(productId)         // boolean
const lowStock = checkLowStock(productId)       // boolean
const warnings = getLowStockWarnings()          // Array<Product>
```

## Common Code Patterns

### Pattern 1: Add to Cart (Check Stock)
```javascript
const { checkInStock } = useProduct()

if (checkInStock(productId)) {
  cartContext.addToCart(product)
  alert('Added to cart!')
} else {
  alert('Product out of stock')
}
```

### Pattern 2: Validate & Checkout
```javascript
const { validateCartStock, processOrderAndDecrementStock } = checkoutValidation
const productContext = useProduct()

const { valid, errors } = validateCartStock(cartItems, productContext)
if (!valid) {
  return alert('Errors: ' + errors.join('\n'))
}

const order = await processOrderAndDecrementStock(cartItems, productContext)
if (order.success) {
  navigate('/')
}
```

### Pattern 3: Admin Stock Control
```javascript
const { increaseStock, decreaseStock } = useProduct()

// Restock
const result = increaseStock('prod-123', 50)

// Process sale
const result = decreaseStock('prod-123', 1)
if (!result.success) console.error(result.error)
```

### Pattern 4: Get Low Stock Products
```javascript
const { getLowStockWarnings } = useProduct()
const alerts = getLowStockAlerts(productContext)

{alerts.map(alert => (
  <div key={alert.productId}>
    {alert.productName}: {alert.currentStock} left
  </div>
))}
```

## Error Handling

### Check Success Flag
```javascript
const result = addProduct(data)
if (!result.success) {
  console.error(result.error)
  // "Category does not exist"
  // "Product name is required"
  // "Category already exists"
}
```

### Try/Catch (Async)
```javascript
try {
  const result = await processOrderAndDecrementStock(items, context)
  if (result.success) {
    // Handle order
  } else {
    alert(result.error)
  }
} catch (err) {
  console.error(err)
}
```

## Response Objects

### Product Operations
```javascript
{
  success: true,
  product: {
    id: 'prod-123',
    name: 'Ring',
    price: 5000,
    categoryId: 'cat-456',
    stock: 10,
    lowStockThreshold: 5
  }
}

// OR

{
  success: false,
  error: 'Selected category does not exist'
}
```

### Stock Operations
```javascript
{
  success: true,
  product: {
    id: 'prod-123',
    stock: 9  // Decreased from 10
  }
}

// OR

{
  success: false,
  error: 'Insufficient stock. Current: 2, Requested: 5'
}
```

### Order Processing
```javascript
{
  success: true,
  order: {
    orderId: 'ORD-1707986400000',
    items: [
      { productId: 'prod-123', quantity: 2, product: {...} }
    ]
  }
}

// OR

{
  success: false,
  error: 'Failed to process 1 item(s)',
  failedItems: [
    { productId: 'prod-xyz', error: 'Insufficient stock' }
  ]
}
```

## Console Output

Look for emoji indicators:
```
✅ Product added: prod-123
❌ Category not found: cat-xyz
⚠  Low stock alert: only 2 units left
📦 Product operations
📂 Category operations
📡 API operations
```

## localStorage Keys

```javascript
localStorage.kk_products    // Array of products
localStorage.kk_categories  // Array of categories
localStorage.kk_cart        // Cart items
localStorage.lastOrder      // Last placed order
```

## Testing Commands

```javascript
// Add test products
const { addProduct, addCategory } = useProduct()

addCategory('Rings')
// -> { success: true, category: { id: 'cat-...', name: 'Rings' } }

addProduct({
  name: 'Gold Ring',
  price: 5000,
  categoryId: 'cat-...',
  stock: 10
})
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Category does not exist" | categoryId not found | Create category first with `addCategory()` |
| "Insufficient stock" | Requested qty > available | Check `checkInStock()` before order |
| "Category already exists" | Duplicate category name | Use unique names |
| "Product not found" | productId invalid | Verify ID with `getProductById()` |
| "Cannot delete category" | Products assigned | Delete products first |

## Validation Functions

```javascript
import { validateProductSchema } from '@/customer/models/productModels'

const validation = validateProductSchema(product, categories)
console.log(validation.valid)   // boolean
console.log(validation.errors)  // Array<string>
```

## Get Current Info

```javascript
// All products
const all = useProduct().products

// Filtered  
const available = products.filter(p => p.stock > 0)
const lowStock = getLowStockWarnings()
const inCategory = getProductsInCategory('cat-123')

// Single item
const product = getProductById('prod-123')
```

## Set New Data

```javascript
// Don't do this - use ProductContext methods!
// ❌ setProducts([...]) directly
// ❌ localStorage.setItem() directly

// ✅ Do this instead:
const result = addProduct(newProduct)
const result = updateProduct(id, changes)
const result = deleteProduct(id)
```

## API Endpoints (Mock)

```
GET    /api/products                   → fetchProductsApi()
GET    /api/products/:id               → fetchProductByIdApi(id)
POST   /api/products                   → createProductApi(data)
PUT    /api/products/:id               → updateProductApi(id, data)
DELETE /api/products/:id               → deleteProductApi(id)
GET    /api/products?category=:catId   → fetchProductsByCategoryApi(catId)
GET    /api/products/stock/low         → fetchLowStockProductsApi()
PATCH  /api/products/:id/stock/decrease → decreaseProductStockApi(id, amt)
PATCH  /api/products/:id/stock/increase → increaseProductStockApi(id, amt)

GET    /api/categories                 → fetchCategoriesApi()
GET    /api/categories/:id             → fetchCategoryByIdApi(id)
POST   /api/categories                 → createCategoryApi(data)
PUT    /api/categories/:id             → updateCategoryApi(id, data)
DELETE /api/categories/:id             → deleteCategoryApi(id)
```

## Component Integration Example

```javascript
import { useProduct } from '@/customer/context/ProductContext'
import { validateCartStock } from '@/customer/utils/checkoutValidation'

export default function MyComponent() {
  const {
    products,
    categories,
    addProduct,
    decreaseStock,
    getLowStockWarnings
  } = useProduct()

  const handleOrder = async () => {
    const { valid, errors } = validateCartStock(cartItems, this)
    if (!valid) {
      return alert(errors.join('\n'))
    }
    // Process order...
  }

  return (
    // JSX here
  )
}
```

## Debugging Tips

```javascript
// Check what's in context
const context = useProduct()
console.log('Products:', context.products)
console.log('Categories:', context.categories)

// Check product details
const p = context.getProductById('prod-123')
console.log('In stock?', p.stock > 0)
console.log('Price:', p.price)

// Check category
const c = context.getCategory('cat-123')
console.log('Products in category:', context.getProductsInCategory(c.id))

// Check localStorage
console.log('Raw products:', localStorage.getItem('kk_products'))
console.log('Raw categories:', localStorage.getItem('kk_categories'))
```

## Quick Checklist - Building New Feature

- [ ] Import `useProduct`
- [ ] Get data from context: `const { products, categories } = useProduct()`
- [ ] Check `result.success` on all operations
- [ ] Validate stock before checkout: `validateCartStock()`
- [ ] Handle errors with `if (!result.success)`
- [ ] Show meaningful error messages to user
- [ ] Test in DevTools localStorage
- [ ] Check console for emoji logs

---

**Bookmark this for quick lookup!** 📌

For detailed documentation, see:
- `PRODUCT_SYSTEM_ARCHITECTURE.md` - Full design doc
- `PRODUCT_INTEGRATION_GUIDE.md` - Code examples
- Inline comments in each file
