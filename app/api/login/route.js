import connectToDb from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
const jwt= require('jsonwebtoken');

export async function POST(request) {
    try {
        await connectToDb();
        const {email,password} = await request.json();

        const UserExisted = await User.findOne({email});
        if(!UserExisted){
            return NextResponse.json({error: "User Not Existed"})
        }

        const passwordMatch = await bcrypt.compare(password,UserExisted.password)
        if(!passwordMatch){
            return NextResponse.json({error: "Incorrect Password"})
        }

        const jwtToken = jwt.sign({userId: UserExisted._id.toString(), email }, process.env.JWT_SECRET, { expiresIn: '6h' });
        

        return NextResponse.json({message:"Success",jwtToken, status: 201})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({error, status: 500})
    }
}