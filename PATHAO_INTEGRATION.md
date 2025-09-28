# Pathao Courier API Integration

This document provides comprehensive information about the Pathao Courier API integration implemented in this Next.js admin frontend application.

## Overview

The Pathao Courier API integration provides a complete solution for managing courier deliveries through the Pathao platform. This integration includes order management, price calculation, location services, and bulk operations.

## Features

### 🔐 Authentication

- Integrated with existing admin authentication system
- Uses Bearer token authentication for Pathao API calls
- Automatic token refresh handling

### 📍 Location Services

- **City Selection**: Get available cities from Pathao
- **Zone Selection**: Get zones for selected city
- **Area Selection**: Get areas for selected zone
- **Hierarchical Location Management**: City → Zone → Area selection flow

### 💰 Price Calculation

- Real-time delivery price calculation
- Support for different item types (Document, Parcel)
- Multiple delivery options (12h, 24h, 48h)
- Weight-based pricing

### 📦 Order Management

- **Order Listing**: Paginated order list with search and filters
- **Order Details**: Comprehensive order information display
- **Status Updates**: Real-time order status management
- **Order Tracking**: Track orders by consignment ID

### 🚚 Order Creation

- **Single Order Creation**: Create individual orders with full validation
- **Bulk Order Creation**: Upload CSV files for bulk order processing
- **Form Validation**: Bangladesh phone number validation, address validation
- **Price Integration**: Calculate prices before order creation

## API Endpoints

### Base Configuration

- **Base URL**: `http://localhost:8000`
- **Authentication**: Bearer Token
- **Content-Type**: `application/json`

### Available Endpoints

#### Authentication

- `POST /auth/login` - Admin login

#### Location Services

- `GET /pathao/cities` - Get available cities
- `GET /pathao/cities/{cityId}/zones` - Get zones for a city
- `GET /pathao/zones/{zoneId}/areas` - Get areas for a zone

#### Price & Store Services

- `POST /pathao/price/calculate` - Calculate delivery price
- `GET /pathao/stores` - Get merchant stores

#### Order Management

- `GET /pathao/orders` - Get all orders (with pagination)
- `GET /pathao/orders/{orderId}` - Get order details
- `PATCH /pathao/orders/{orderId}/status` - Update order status
- `GET /pathao/orders/info/{consignmentId}` - Get order by consignment ID

#### Create Orders

- `POST /pathao/order` - Create single order
- `POST /pathao/orders/bulk` - Create bulk orders

## File Structure

```
├── redux/api/
│   └── pathaoApi.js                 # RTK Query API definitions
├── redux/
│   └── tagTypes.js                  # Updated with Pathao tags
├── components/pathao/
│   ├── LocationSelector.jsx         # Hierarchical location selection
│   ├── PriceCalculator.jsx         # Price calculation component
│   ├── OrderList.jsx               # Orders listing with filters
│   ├── OrderDetails.jsx            # Order details view
│   ├── OrderForm.jsx               # Single order creation form
│   └── BulkOrderForm.jsx           # Bulk order creation with CSV upload
├── app/(private)/(with-sidebar)/super-admin/pathao/
│   ├── orders/
│   │   ├── page.jsx                # Orders list page
│   │   ├── create/page.jsx         # Create order page
│   │   ├── bulk/page.jsx           # Bulk orders page
│   │   └── [id]/page.jsx           # Order details page
│   └── calculator/page.jsx         # Price calculator page
└── utils/
    └── constant.js                 # Updated with Pathao menu items
```

## Components Documentation

### LocationSelector

Hierarchical location selection component with city → zone → area flow.

**Props:**

- `onLocationChange`: Callback when location changes
- `initialValues`: Initial location values
- `disabled`: Disable all selectors
- `required`: Make selection required

**Usage:**

```jsx
<LocationSelector
  onLocationChange={(location) => console.log(location)}
  required={true}
/>
```

### PriceCalculator

Real-time price calculation with location and item details.

**Props:**

- `onPriceCalculated`: Callback when price is calculated

**Usage:**

```jsx
<PriceCalculator onPriceCalculated={(price) => console.log(price)} />
```

### OrderForm

Comprehensive order creation form with validation.

**Props:**

- `onOrderCreated`: Callback when order is created successfully

**Features:**

- Bangladesh phone number validation
- Integrated price calculator
- Location selection
- Form validation with Ant Design

### OrderList

Orders listing with search, filters, and pagination.

**Features:**

- Search by Order ID, Consignment ID, or Recipient
- Status filtering
- Pagination
- Status update functionality
- Responsive design

### OrderDetails

Detailed order information display.

**Props:**

- `orderId`: Order ID to display details for

**Features:**

- Complete order information
- Status update modal
- Responsive layout
- Error handling

### BulkOrderForm

CSV-based bulk order creation.

**Features:**

- CSV template download
- Drag & drop file upload
- Order validation
- Progress tracking
- Results display

## Data Models

### Order Data Structure

```javascript
{
  order_id: "ORD-TEST-001",
  recipient_name: "John Doe",
  recipient_phone: "01712345678",
  recipient_secondary_phone: "01787654321",
  recipient_address: "House 123, Road 4, Sector 10, Uttara, Dhaka-1230",
  delivery_type: 48, // 12, 24, or 48 hours
  item_type: 2, // 1: Document, 2: Parcel
  special_instruction: "Please deliver before 5 PM",
  item_quantity: 1,
  item_weight: "0.5",
  item_description: "Clothing items",
  amount_to_collect: 900,
  recipient_city: 1,
  recipient_zone: 3069,
  recipient_area: 1234
}
```

### Price Calculation Data

```javascript
{
  item_type: 2,
  delivery_type: 48,
  item_weight: "0.5",
  recipient_city: 1,
  recipient_zone: 3069
}
```

## Validation Rules

### Phone Number Validation

- Format: Bangladesh phone numbers
- Pattern: `^(\+88|88)?(01[3-9]\d{8})$`
- Examples: `01712345678`, `+8801712345678`, `8801712345678`

### Required Fields

- Order ID (unique)
- Recipient name
- Recipient phone
- Recipient address
- Delivery type
- Item type
- Item quantity
- Item weight
- Item description
- Amount to collect
- Location (city, zone)

## Error Handling

### API Error Handling

- Network error handling with retry mechanisms
- User-friendly error messages
- Loading states for all operations
- Validation error display

### Form Validation

- Real-time validation feedback
- Required field validation
- Format validation (phone, weight, etc.)
- Custom validation messages

## Usage Examples

### Creating a Single Order

1. Navigate to "Pathao Courier" → "Create Order"
2. Fill in recipient information
3. Select delivery location (city → zone → area)
4. Enter item details
5. Optionally calculate price first
6. Submit the form

### Bulk Order Creation

1. Navigate to "Pathao Courier" → "Bulk Orders"
2. Download the CSV template
3. Fill in order details in the CSV
4. Upload the CSV file
5. Review the orders preview
6. Submit for bulk creation

### Price Calculation

1. Navigate to "Pathao Courier" → "Price Calculator"
2. Select delivery location
3. Enter item type and weight
4. Choose delivery type
5. Click "Calculate Price"

## Environment Variables

Make sure to set the following environment variables:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

## Authentication Setup

The integration uses the existing authentication system. Make sure you're logged in with admin credentials:

```javascript
// Default admin credentials
{
  "email": "superadmin@ecommerce.com",
  "password": "1234567"
}
```

## Navigation

The Pathao integration adds the following menu items to the sidebar:

- **Pathao Courier**
  - Orders (List all orders)
  - Create Order (Single order creation)
  - Bulk Orders (CSV-based bulk creation)
  - Price Calculator (Standalone price calculator)

## Best Practices

### Performance

- Use React Query caching for location data
- Implement debounced search
- Lazy load components where appropriate
- Optimize table rendering with pagination

### User Experience

- Provide clear loading states
- Show progress for bulk operations
- Implement optimistic updates where safe
- Use confirmation dialogs for destructive actions

### Error Handling

- Always provide fallback UI for errors
- Implement retry mechanisms
- Show user-friendly error messages
- Log errors for debugging

## Troubleshooting

### Common Issues

1. **Location data not loading**
   - Check API endpoint availability
   - Verify authentication token
   - Check network connectivity

2. **Price calculation fails**
   - Ensure all required fields are filled
   - Verify location selection is complete
   - Check item weight format

3. **Order creation fails**
   - Validate all required fields
   - Check phone number format
   - Verify location IDs are valid

4. **Bulk upload issues**
   - Ensure CSV format matches template
   - Check for missing required fields
   - Verify data types (numbers vs strings)

### Debug Mode

Enable debug logging by adding to your environment:

```env
NODE_ENV=development
```

## Future Enhancements

### Planned Features

- Order tracking with real-time updates
- SMS/Email notifications
- Advanced reporting and analytics
- Integration with other courier services
- Mobile app support

### API Improvements

- Webhook support for status updates
- Rate limiting handling
- Caching strategies
- Offline support

## Support

For issues related to the Pathao integration:

1. Check this documentation first
2. Review the API responses in browser dev tools
3. Check the Redux DevTools for state management issues
4. Verify environment variables are set correctly

## Contributing

When contributing to the Pathao integration:

1. Follow the existing code structure
2. Add proper TypeScript types if converting
3. Include comprehensive error handling
4. Update this documentation
5. Add unit tests for new components
6. Test with real API endpoints

---

This integration provides a complete solution for managing Pathao courier services within your admin panel. The modular design allows for easy maintenance and future enhancements.
