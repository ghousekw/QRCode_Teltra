# Product Catalogue with QR Code System

A Next.js application that allows you to create digital product catalogues with QR codes for easy sharing and downloading. Features full CRUD (Create, Read, Update, Delete) operations for both catalogues and products.

## Features

- **Create Catalogues**: Build custom product catalogues with titles and descriptions
- **Read Catalogues**: View all catalogues with their products
- **Update Catalogues**: Edit catalogue titles and descriptions
- **Delete Catalogues**: Remove catalogues (also deletes associated products)
- **Create Products**: Add products to catalogues with names, descriptions, and download links
- **Read Products**: View products within their catalogues
- **Update Products**: Edit product names, descriptions, and download URLs
- **Delete Products**: Remove individual products from catalogues
- **Generate QR Codes**: Automatically generate QR codes that link to your catalogues
- **Mobile-Friendly Display**: Beautiful responsive catalogue pages for mobile and desktop
- **Download Products**: Users can download product files directly from the catalogue

## How It Works

### Catalogue Management
1. **Create a Catalogue**: 
   - Click "Create New Catalogue" on the home page
   - Enter a title and description for your catalogue
   - Click "Create Catalogue"

2. **Read/View Catalogues**:
   - All catalogues are displayed on the home page
   - Each catalogue shows its title, description, and product count
   - Click edit/delete buttons to manage catalogues

3. **Update a Catalogue**:
   - Click the edit icon (pencil) on any catalogue card
   - Modify the title and/or description
   - Click "Update Catalogue"

4. **Delete a Catalogue**:
   - Click the delete icon (trash) on any catalogue card
   - Confirm deletion in the popup dialog
   - Note: This will also delete all products in the catalogue

### Product Management
1. **Create a Product**:
   - Click "Add Product" on any catalogue card
   - Enter product details (name, description)
   - Optionally add a download URL for the product file
   - Click "Add Product"

2. **Read/View Products**:
   - Products are listed within their catalogue cards
   - Hover over products to see edit/delete options
   - Products display with their names and download availability

3. **Update a Product**:
   - Hover over a product in the catalogue list
   - Click the edit icon (pencil) that appears
   - Modify product details as needed
   - Click "Update Product"

4. **Delete a Product**:
   - Hover over a product in the catalogue list
   - Click the delete icon (trash) that appears
   - Confirm deletion in the popup dialog

### QR Code Generation
1. **Generate QR Code**:
   - Click "Generate QR" on any catalogue card
   - A QR code will be generated that links to your catalogue

2. **Share and Download**:
   - Share the QR code with customers
   - When scanned, users will see your catalogue on their mobile device
   - They can browse products and download files if available

3. **Automatic URL Detection**:
   - The system automatically detects the current domain when generating QR codes
   - This ensures QR codes work correctly in both development and production
   - No manual configuration required for most deployment scenarios

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **QR Code Generation**: qrcode library
- **Icons**: Lucide React

## API Endpoints

### Catalogue Endpoints
- `GET /api/catalogues` - Get all catalogues
- `POST /api/catalogues` - Create a new catalogue
- `GET /api/catalogues/[id]` - Get a specific catalogue
- `PUT /api/catalogues/[id]` - Update a catalogue
- `DELETE /api/catalogues/[id]` - Delete a catalogue

### Product Endpoints
- `POST /api/catalogues/[id]/products` - Add a product to a catalogue
- `PUT /api/catalogues/[id]/products/[productId]` - Update a product
- `DELETE /api/catalogues/[id]/products/[productId]` - Delete a product

### QR Code Endpoints
- `POST /api/catalogues/[id]/qrcode` - Generate QR code for a catalogue

## Database Schema

### Catalogue
- `id` - Unique identifier
- `title` - Catalogue title
- `description` - Catalogue description
- `qrCodeUrl` - URL to the generated QR code image
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Product
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `image` - Product image URL (optional)
- `fileUrl` - Download file URL (optional)
- `catalogueId` - Associated catalogue ID
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Configuration

The application automatically detects the current domain for QR code generation. However, if you need to explicitly set the base URL (for example, in custom deployment scenarios), you can create a `.env.local` file:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your domain
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Note**: In most cases, you don't need to set this variable as the system will automatically detect the correct URL from the request headers.

## Usage Examples

### Example Use Cases

1. **Digital Product Catalogue**: Create a catalogue for your digital products (e-books, software, templates) with download links and full CRUD management

2. **Restaurant Menu**: Create a menu catalogue with QR codes on tables for customers to view and download, with easy menu updates

3. **Real Estate Listings**: Create property catalogues with downloadable brochures, allowing agents to update listings and remove sold properties

4. **Event Materials**: Create catalogues for events with downloadable schedules and materials, with the ability to update content as needed

5. **Educational Resources**: Create learning material catalogues with downloadable resources, allowing instructors to update course materials

## CRUD Operations Summary

### Catalogue CRUD
- **Create**: New catalogue with title and description
- **Read**: View all catalogues or individual catalogue details
- **Update**: Modify existing catalogue information
- **Delete**: Remove catalogue and all associated products

### Product CRUD
- **Create**: Add new product to existing catalogue
- **Read**: View products within their catalogue context
- **Update**: Modify existing product information
- **Delete**: Remove individual products from catalogue

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── catalogues/
│   │       ├── [id]/
│   │       │   ├── products/
│   │       │   │   ├── [productId]/
│   │       │   │   │   └── route.ts
│   │       │   │   ├── route.ts
│   │       │   │   └── qrcode/
│   │       │   │       └── route.ts
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── catalogue/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   └── ui/
└── lib/
    ├── db.ts
    └── utils.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (use the provided CRUD test pattern)
5. Submit a pull request

## License

This project is open source and available under the MIT License.