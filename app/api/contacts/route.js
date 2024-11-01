import connectToDb from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectToDb();

        const userId = request.userId;

        const { name, email, phone, address, timezone } = await request.json();

        const newContact = new Contact({ name, email, phone, address, timezone, userId });
        await newContact.save();

        return NextResponse.json({ message: "Contact added successfully", contact: newContact }, { status: 201 });
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: "Failed to add contact", details: error.message }, { status: 500 });
    }
}

// GET: Retrieve contacts (JWT protected)
export async function GET(request) {
    try {
        await connectToDb();

        const userId = request.userId; // Ensure you have the userId from the token or session
        console.log(userId);

        // Fetch only non-deleted contacts
        const contacts = await Contact.find({ deleted: false }); // Adjust your schema to have a 'deleted' field

        return NextResponse.json({ contacts });
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: "Failed to retrieve contacts", details: error.message }, { status: 500 });
    }
}

