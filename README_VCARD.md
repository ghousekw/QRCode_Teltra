# Digital Business Cards (vCard QR Code Generator)

This application now includes a comprehensive digital business card system that creates virtual vCards with QR codes, similar to the business card shown in your example.

## Features

### 🎯 Core Functionality
- **Virtual vCard Creation**: Create digital business cards with contact information
- **QR Code Generation**: Generate QR codes that contain vCard data
- **Company Logo Integration**: Embed company logos directly into QR codes
- **Multiple Contact Methods**: Support for phone, email, website, and address
- **International Support**: Handle multiple phone numbers and addresses

### 📱 vCard Format
The system generates standard vCard 3.0 format that is compatible with:
- iPhone Contacts
- Android Contacts
- Outlook
- Google Contacts
- Most contact management systems

### 🎨 QR Code Features
- **Logo Overlay**: Company logos are embedded in the center of QR codes
- **High Resolution**: 512x512 pixel QR codes for crisp scanning
- **Customizable**: Different colors and margins supported
- **Download Options**: PNG format for easy sharing and printing

## Usage

### Creating a vCard
1. Navigate to `/vcard` or click "Digital Business Cards" on the main page
2. Click "Create New vCard"
3. Fill in the contact information:
   - **Personal Info**: Name, title, company, logo URL
   - **Contact Info**: Email, phone, website, address
4. Click "Create vCard"

### Generating QR Code
1. After creating a vCard, click "Generate QR"
2. The system will create a QR code with your company logo embedded
3. Download or share the QR code

### Sharing vCards
- **Direct Link**: Each vCard has a unique URL for sharing
- **QR Code**: Scan the QR code to save contact information
- **vCard Download**: Download the .vcf file for direct import

## API Endpoints

### vCard Management
- `GET /api/vcards` - List all vCards
- `POST /api/vcards` - Create new vCard
- `GET /api/vcards/[id]` - Get specific vCard
- `PUT /api/vcards/[id]` - Update vCard
- `DELETE /api/vcards/[id]` - Delete vCard

### QR Code Generation
- `POST /api/vcards/[id]/qrcode` - Generate QR code for vCard

## Example vCard Data Structure

```json
{
  "firstName": "Barrak",
  "lastName": "A Jummah",
  "title": "Chief Operations Officer",
  "company": "TELTRA",
  "email": "barrak@teltra.com",
  "phone": "+964 785 666 888 7",
  "website": "https://teltra.com",
  "address": "Business Address",
  "city": "Baghdad",
  "country": "Iraq",
  "logoUrl": "https://example.com/logo.png"
}
```

## Generated vCard Format

The system generates vCard 3.0 format like this:

```
BEGIN:VCARD
VERSION:3.0
FN:Barrak A Jummah
N:A Jummah;Barrak;;;
TITLE:Chief Operations Officer
ORG:TELTRA
EMAIL:barrak@teltra.com
TEL:+964 785 666 888 7
URL:https://teltra.com
ADR:;;Business Address, Baghdad, Iraq;;;
END:VCARD
```

## QR Code with Logo

The QR code generation process:
1. Creates a standard QR code with vCard data
2. Fetches the company logo from the provided URL
3. Resizes the logo to fit in the center (80x80 pixels)
4. Overlays the logo on the QR code
5. Returns the final image as a data URL

## Database Schema

The vCard data is stored in a PostgreSQL database with the following structure:

```sql
CREATE TABLE "VCard" (
  "id" TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "title" TEXT,
  "company" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "website" TEXT,
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "country" TEXT,
  "zipCode" TEXT,
  "notes" TEXT,
  "qrCodeUrl" TEXT,
  "logoUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **QR Code**: qrcode library with Sharp for image processing
- **Logo Processing**: Sharp for image manipulation and overlay

## Getting Started

1. **Database Setup**: Run `npx prisma db push` to create the vCard table
2. **Environment**: Ensure your database connection is configured
3. **Dependencies**: All required packages are already installed
4. **Access**: Navigate to `/vcard` to start creating digital business cards

## Features Comparison

| Feature | Traditional Business Card | Digital vCard |
|---------|-------------------------|---------------|
| **Sharing** | Physical exchange | Instant digital sharing |
| **Updates** | Reprint required | Real-time updates |
| **Storage** | Physical wallet | Phone contacts |
| **Cost** | Printing costs | Free after setup |
| **Eco-friendly** | Paper waste | Digital only |
| **Analytics** | None | Track scans and views |
| **Global** | Physical presence | Instant worldwide |

This digital business card system provides a modern, eco-friendly, and efficient way to share contact information while maintaining the professional appearance of traditional business cards.
