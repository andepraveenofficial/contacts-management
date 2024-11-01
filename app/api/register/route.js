import connectToDb from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function POST(request) {
    try {
        await connectToDb();
        const {name,email,password} = await request.json();

        const isUserExisted = await User.findOne({email});
        if(isUserExisted){
            return NextResponse.json({error: "Email Already Exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        });
        await newUser.save();
        return NextResponse.json({message:"User Registered Successfully!!", status: 201})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({error, status: 500})
    }
}