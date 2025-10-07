import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const vcard = await prisma.vCard.findUnique({
      where: { id },
      include: {
        phoneNumbers: true
      }
    })

    if (!vcard) {
      return NextResponse.json({ error: 'vCard not found' }, { status: 404 })
    }

    return NextResponse.json(vcard)
  } catch (error) {
    console.error('Error fetching vCard:', error)
    return NextResponse.json({ error: 'Failed to fetch vCard' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, arabicFirstName, arabicLastName, title, company, email, phone, website, address, city, state, country, zipCode, notes, logoUrl, instagram, facebook, twitter, linkedin, youtube, tiktok, snapchat, telegram, whatsapp, phoneNumbers } = body

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 })
    }

    // First, delete existing phone numbers
      await prisma.phoneNumber.deleteMany({
      where: { vcardId: id }
    })

    const vcard = await prisma.vCard.update({
      where: { id },
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
    console.error('Error updating vCard:', error)
    return NextResponse.json({ error: 'Failed to update vCard' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.vCard.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'vCard deleted successfully' })
  } catch (error) {
    console.error('Error deleting vCard:', error)
    return NextResponse.json({ error: 'Failed to delete vCard' }, { status: 500 })
  }
}
