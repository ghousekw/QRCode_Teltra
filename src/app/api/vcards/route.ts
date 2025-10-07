import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const vcards = await prisma.vCard.findMany({
      include: {
        phoneNumbers: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    
    return NextResponse.json(vcards)
  } catch (error) {
    console.error('Error fetching vCards:', error)
    return NextResponse.json({ error: 'Failed to fetch vCards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, arabicFirstName, arabicLastName, title, company, email, phone, website, address, city, state, country, zipCode, notes, logoUrl, instagram, facebook, twitter, linkedin, youtube, tiktok, snapchat, telegram, whatsapp, phoneNumbers } = body


    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 })
    }

    const vcard = await prisma.vCard.create({
      data: {
        firstName,
        lastName,
        arabicFirstName,
        arabicLastName,
        title,
        company,
        email,
        phone,
        website,
        address,
        city,
        state,
        country,
        zipCode,
        notes,
        logoUrl,
        instagram,
        facebook,
        twitter,
        linkedin,
        youtube,
        tiktok,
        snapchat,
        telegram,
        whatsapp,
        phoneNumbers: phoneNumbers ? {
          create: phoneNumbers.map((pn: any) => ({
            number: pn.number,
            country: pn.country,
            type: pn.type || 'office'
          }))
        } : undefined
      },
      include: {
        phoneNumbers: true
      }
    })

    return NextResponse.json(vcard)
  } catch (error) {
    console.error('Error creating vCard:', error)
    return NextResponse.json({ error: 'Failed to create vCard' }, { status: 500 })
  }
}
