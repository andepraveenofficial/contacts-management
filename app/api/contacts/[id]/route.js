import connectToDb from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from 'next/server';

// PATCH: Update contact (JWT protected)
export async function PUT(request, { params }) {
    try {
        await connectToDb();
        const contactId = params.id;
        const { name, email, phone, address, timezone } = await request.json();

        const updatedContact = await Contact.findByIdAndUpdate(contactId, { name, email, phone, address, timezone }, { new: true });

        if (!updatedContact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact updated successfully", contact: updatedContact });
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: "Failed to update contact", details: error.message }, { status: 500 });
    }
}

// DELETE: Soft delete contact (JWT protected)
export async function DELETE(request, { params }) {
    try {
        await connectToDb();
        const contactId = params.id;

        const deletedContact = await Contact.findByIdAndUpdate(contactId, { deleted: true }, { new: true });

        if (!deletedContact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact soft deleted successfully", contact: deletedContact });
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: "Failed to delete contact", details: error.message }, { status: 500 });
    }
}
