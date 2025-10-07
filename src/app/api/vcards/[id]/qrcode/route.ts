import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'
import sharp from 'sharp'

const prisma = new PrismaClient()

function generateVCardString(vcard: any): string {
  let vcardString = 'BEGIN:VCARD\n'
  vcardString += 'VERSION:3.0\n'
  vcardString += `FN:${vcard.firstName} ${vcard.lastName}\n`
  vcardString += `N:${vcard.lastName};${vcard.firstName};;;\n`
  
  if (vcard.title) {
    vcardString += `TITLE:${vcard.title}\n`
  }
  
  if (vcard.company) {
    vcardString += `ORG:${vcard.company}\n`
  }
  
  if (vcard.email) {
    vcardString += `EMAIL:${vcard.email}\n`
  }
  
  if (vcard.phone) {
    vcardString += `TEL:${vcard.phone}\n`
  }
  
  // Add phone numbers from phoneNumbers array
  if (vcard.phoneNumbers && vcard.phoneNumbers.length > 0) {
    vcard.phoneNumbers.forEach((phone: any) => {
      if (phone.type === 'whatsapp') {
        vcardString += `TEL;TYPE=CELL:${phone.number}\n`
        vcardString += `X-WHATSAPP:${phone.number}\n`
      } else {
        vcardString += `TEL;TYPE=${phone.type?.toUpperCase() || 'VOICE'}:${phone.number}\n`
      }
    })
  }
  
  if (vcard.website) {
    vcardString += `URL:${vcard.website}\n`
  }
  
  if (vcard.address || vcard.city || vcard.state || vcard.country || vcard.zipCode) {
    let address = ''
    if (vcard.address) address += vcard.address
    if (vcard.city) address += (address ? ', ' : '') + vcard.city
    if (vcard.state) address += (address ? ', ' : '') + vcard.state
    if (vcard.zipCode) address += (address ? ' ' : '') + vcard.zipCode
    if (vcard.country) address += (address ? ', ' : '') + vcard.country
    vcardString += `ADR:;;${address};;;\n`
  }
  
  if (vcard.notes) {
    vcardString += `NOTE:${vcard.notes}\n`
  }
  
  vcardString += 'END:VCARD'
  return vcardString
}

async function generateQRCodeWithLogo(url: string, logoUrl?: string): Promise<string> {
  try {
    // Generate QR code as buffer directly
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    if (!logoUrl) {
      return `data:image/png;base64,${qrCodeBuffer.toString('base64')}`
    }

    try {
      console.log('Fetching logo from:', logoUrl)
      // Fetch logo
      const logoResponse = await fetch(logoUrl)
      if (!logoResponse.ok) {
        console.warn('Failed to fetch logo, using QR code without logo. Status:', logoResponse.status)
        return `data:image/png;base64,${qrCodeBuffer.toString('base64')}`
      }
      
      console.log('Logo fetched successfully')
      const logoBuffer = await logoResponse.arrayBuffer()
      
      // Process logo with sharp
      const logo = await sharp(Buffer.from(logoBuffer))
        .resize(80, 80, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()

      console.log('Logo processed successfully, size:', logo.length)

      // Create final image with logo overlay
      const finalImage = await sharp(qrCodeBuffer)
        .composite([{
          input: logo,
          top: 216, // Center vertically (512-80)/2
          left: 216  // Center horizontally (512-80)/2
        }])
        .png()
        .toBuffer()

      console.log('Final image with logo created successfully')
      return `data:image/png;base64,${finalImage.toString('base64')}`
    } catch (logoError) {
      console.warn('Error processing logo, using QR code without logo:', logoError)
      return `data:image/png;base64,${qrCodeBuffer.toString('base64')}`
    }
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log('QR code generation request for vCard ID:', id)
    
    const vcard = await prisma.vCard.findUnique({
      where: { id }
    })

    if (!vcard) {
      console.log('vCard not found for ID:', id)
      return NextResponse.json({ error: 'vCard not found' }, { status: 404 })
    }

    console.log('vCard found:', vcard.firstName, vcard.lastName, 'Logo URL:', vcard.logoUrl)

    // Generate URL for QR code using the request's origin
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    
    if (!baseUrl) {
      const origin = request.headers.get('origin') || request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      baseUrl = origin ? `${protocol}://${origin}` : 'http://localhost:3001'
    }
    
    // Ensure baseUrl doesn't have double protocol
    if (baseUrl.startsWith('https://https://') || baseUrl.startsWith('http://http://')) {
      baseUrl = baseUrl.replace(/^https?:\/\/https?:\/\//, 'https://')
    }
    
    const vcardUrl = `${baseUrl}/vcard/${id}`
    console.log('Generated vCard URL:', vcardUrl)
    
    // Generate QR code with logo
    console.log('Starting QR code generation with logo...')
    const qrCodeDataURL = await generateQRCodeWithLogo(vcardUrl, vcard.logoUrl)
    console.log('QR code generated successfully, length:', qrCodeDataURL.length)

    // Update vCard with QR code URL
    const updatedVCard = await prisma.vCard.update({
      where: { id },
      data: { qrCodeUrl: qrCodeDataURL }
    })
    console.log('vCard updated with QR code URL')

    return NextResponse.json({ 
      qrCodeUrl: qrCodeDataURL,
      vcardUrl: vcardUrl,
      vcardString: generateVCardString(vcard) // Still provide vCard string for download
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
