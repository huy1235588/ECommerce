# Admin Panel Documentation

## Tổng quan

Admin Panel là giao diện quản trị dành cho quản trị viên và nhân viên để quản lý toàn bộ hoạt động của nền tảng E-Commerce.

## Kiến trúc

### Layout Structure

```
┌─────────────────────────────────────────┐
│           Admin Header                   │
│  [☰] [Search] [Theme] [🔔] [👤]        │
├──────────┬──────────────────────────────┤
│          │                               │
│  Admin   │      Main Content            │
│ Sidebar  │      (Dashboard, Pages)      │
│          │                               │
│ [Menu]   │      [Cards, Tables, etc]    │
│ [Items]  │                               │
│          │                               │
└──────────┴──────────────────────────────┘
```

### Route Structure

Tất cả các route admin nằm trong group `(admin)` để share layout:

```
/admin                    → Dashboard
/admin/products          → Quản lý sản phẩm
/admin/orders            → Quản lý đơn hàng
/admin/customers         → Quản lý khách hàng
/admin/categories        → Quản lý danh mục
/admin/analytics         → Thống kê
/admin/settings          → Cài đặt
```

## Components

### 1. AdminSidebar

Component sidebar navigation chính.

**File**: `_components/admin-sidebar.tsx`

**Features**:
- Collapsible (thu gọn/mở rộng)
- Icon mode cho màn hình nhỏ
- Active state highlighting
- Grouped menu items
- Tooltips cho icon mode
- Keyboard shortcut (Ctrl/Cmd + B)

**Menu Structure**:

```tsx
const menuItems = [
  {
    title: "Tổng quan",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { title: "Thống kê", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Quản lý",
    items: [
      { title: "Sản phẩm", url: "/admin/products", icon: Package },
      { title: "Đơn hàng", url: "/admin/orders", icon: ShoppingCart },
      { title: "Khách hàng", url: "/admin/customers", icon: Users },
      { title: "Danh mục", url: "/admin/categories", icon: Tags },
    ],
  },
  {
    title: "Vận hành",
    items: [
      { title: "Vận chuyển", url: "/admin/shipping", icon: Truck },
      { title: "Báo cáo", url: "/admin/reports", icon: FileText },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { title: "Cài đặt", url: "/admin/settings", icon: Settings },
    ],
  },
];
```

### 2. AdminHeader

Component header với search, notifications và user menu.

**File**: `_components/admin-header.tsx`

**Features**:
- Global search bar
- Theme toggle (Dark/Light mode)
- Notifications dropdown
- User profile menu
- Responsive design

**Actions**:
```tsx
<SidebarTrigger />  // Toggle sidebar
<Search />          // Global search
<ThemeToggle />     // Dark/Light mode
<Notifications />   // Notification bell
<UserMenu />        // Profile dropdown
```

## Pages

### 1. Dashboard (/admin)

Trang tổng quan với các thống kê quan trọng.

**Components**:
- Stats cards (Doanh thu, Đơn hàng, Khách hàng, Sản phẩm)
- Recent orders table
- Quick actions

**Metrics**:
- Total revenue với % change
- Number of orders
- Active customers
- Products in stock

### 2. Products (/admin/products)

Quản lý danh sách sản phẩm.

**Features**:
- Product listing với images
- Search và filters
- Stock status badges
- Quick edit/delete actions
- Add new product button

**Filters**:
- Category
- Status (Đang bán, Sắp hết, Hết hàng)
- Price range
- Sort options

### 3. Orders (/admin/orders)

Quản lý đơn hàng.

**Features**:
- Orders table với detailed info
- Status badges
- Customer information
- Order tracking
- Filter by status và date

**Order Statuses**:
- Đang xử lý (Pending)
- Đang giao (In transit)
- Đã giao (Delivered)
- Đã hủy (Cancelled)

### 4. Customers (/admin/customers)

Quản lý khách hàng.

**Features**:
- Customer list với avatars
- Customer stats cards
- Total spent và order count
- Customer tiers (VIP, Thường, Mới)
- Search và sort

**Customer Tiers**:
- **VIP**: > 100M spent
- **Thường**: 10M - 100M spent
- **Mới**: < 10M spent

### 5. Categories (/admin/categories)

Quản lý danh mục sản phẩm.

**Features**:
- Hierarchical categories
- Parent-child relationships
- Product count per category
- Slug management
- Status toggle

**Category Structure**:
```
Điện thoại (Parent)
├── iPhone (Child)
├── Samsung (Child)
└── Xiaomi (Child)

Laptop (Parent)
├── MacBook (Child)
├── Windows Laptop (Child)
└── Gaming Laptop (Child)
```

### 6. Analytics (/admin/analytics)

Thống kê và phân tích.

**Metrics**:
- Monthly revenue chart
- Average order value
- Conversion rate
- Top selling products
- Inventory value
- Customer growth

**Charts**:
- Revenue trend (6 months)
- Order count trend
- Product performance
- Customer retention

### 7. Settings (/admin/settings)

Cài đặt hệ thống.

**Sections**:

#### A. General Settings
- Store name
- Contact email
- Phone number
- Address

#### B. Payment Settings
- COD (Cash on Delivery)
- Bank transfer
- VNPay integration
- MoMo integration

#### C. Shipping Settings
- Fast delivery (24h)
- Standard delivery (3-5 days)
- Free shipping threshold

#### D. Notification Settings
- Email notifications
- SMS notifications
- Low stock alerts

## Styling

### Color Scheme

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 0% 9%;

/* Dark Mode */
--background: 0 0% 3.9%;
--foreground: 0 0% 98%;
--primary: 0 0% 98%;
```

### Sidebar Colors

```css
--sidebar-background: 0 0% 98%;
--sidebar-foreground: 240 5.3% 26.1%;
--sidebar-primary: 240 5.9% 10%;
--sidebar-accent: 240 4.8% 95.9%;
```

## Responsive Design

### Breakpoints

- **Mobile** (< 768px):
  - Sidebar becomes drawer/sheet
  - Table columns reduced
  - Cards stack vertically

- **Tablet** (768px - 1024px):
  - Sidebar icon mode
  - Condensed tables
  - 2-column layouts

- **Desktop** (> 1024px):
  - Full sidebar
  - Full tables
  - Multi-column layouts

### Mobile Optimization

```tsx
// Sidebar behavior
{isMobile && (
  <Sheet>
    <SheetContent>{/* Sidebar content */}</SheetContent>
  </Sheet>
)}

// Table scrolling
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

## State Management

### Current Implementation

Hiện tại sử dụng local state với React hooks.

### Future: Redux Integration

```tsx
// Product slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchProducts: (state) => {
      state.loading = true;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
  },
});
```

## API Integration

### Endpoints Structure

```typescript
// Products
GET    /api/admin/products          // List products
GET    /api/admin/products/:id      // Get product
POST   /api/admin/products          // Create product
PUT    /api/admin/products/:id      // Update product
DELETE /api/admin/products/:id      // Delete product

// Orders
GET    /api/admin/orders            // List orders
GET    /api/admin/orders/:id        // Get order
PUT    /api/admin/orders/:id/status // Update status

// Customers
GET    /api/admin/customers         // List customers
GET    /api/admin/customers/:id     // Get customer

// Analytics
GET    /api/admin/analytics/revenue // Revenue data
GET    /api/admin/analytics/products// Product stats
```

### API Service Example

```typescript
// services/admin/products.ts
export const productService = {
  async getProducts(params?: ProductParams) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  
  async createProduct(data: ProductData) {
    const response = await api.post('/admin/products', data);
    return response.data;
  },
  
  async updateProduct(id: string, data: ProductData) {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },
  
  async deleteProduct(id: string) {
    await api.delete(`/admin/products/${id}`);
  },
};
```

## Authentication & Authorization

### Route Protection

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role
    const user = verifyToken(token);
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### Permission Levels

- **SUPER_ADMIN**: Full access
- **ADMIN**: Manage products, orders, customers
- **STAFF**: View only, update orders

## Performance Optimization

### 1. Code Splitting

```tsx
// Lazy load heavy components
const ProductEditor = dynamic(() => import('./ProductEditor'), {
  loading: () => <Skeleton />,
});
```

### 2. Data Pagination

```tsx
// Server-side pagination
const { data, page, totalPages } = await fetchProducts({
  page: 1,
  limit: 20,
});
```

### 3. Caching

```tsx
// React Query
const { data, isLoading } = useQuery({
  queryKey: ['products', page],
  queryFn: () => fetchProducts(page),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Testing

### Unit Tests

```tsx
// __tests__/admin/dashboard.test.tsx
describe('Dashboard', () => {
  it('renders stats cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Tổng doanh thu')).toBeInTheDocument();
  });
});
```

### Integration Tests

```tsx
// __tests__/admin/products.test.tsx
describe('Products Page', () => {
  it('fetches and displays products', async () => {
    render(<ProductsPage />);
    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });
  });
});
```

## Security

### Best Practices

1. **Input Validation**: Validate all user inputs
2. **CSRF Protection**: Use CSRF tokens
3. **XSS Prevention**: Sanitize HTML content
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Limit API requests
6. **Audit Logging**: Log all admin actions

### Audit Log Example

```typescript
interface AuditLog {
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: string;
  resourceId: string;
  timestamp: Date;
  changes?: Record<string, any>;
}
```

## Deployment

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ADMIN_PATH=/admin
ADMIN_SESSION_SECRET=your-secret-key
```

### Build

```bash
cd frontend
npm run build
npm run start
```

## Future Enhancements

1. **Real-time Updates**: WebSocket cho notifications
2. **Advanced Analytics**: More detailed charts và reports
3. **Bulk Actions**: Bulk edit/delete products
4. **Export Data**: Export to CSV/Excel
5. **Activity Logs**: Detailed audit trail
6. **Multi-language**: i18n support
7. **Mobile App**: React Native admin app
8. **AI Insights**: AI-powered analytics

## Troubleshooting

### Common Issues

**1. Sidebar not opening**
- Check SidebarProvider is wrapping the layout
- Verify useSidebar hook is used correctly

**2. Dark mode not working**
- Ensure ThemeProvider is in root layout
- Check theme cookie is being set

**3. API errors**
- Verify API endpoint URLs
- Check authentication tokens
- Review CORS settings

## Support

For questions or issues:
- GitHub Issues: [repository]/issues
- Email: support@ecommerce.com
- Docs: /docs/admin-panel
