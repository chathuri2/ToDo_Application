import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role || "user";

    // RULE: View Todos 
    // User -> Own todos only
    // Manager/Admin -> All todos
    if (role === "admin" || role === "manager") {
        const todos = await prisma.todo.findMany({
            include: { user: { select: { name: true, email: true } } }
        });
        return NextResponse.json(todos);
    } else {
        const todos = await prisma.todo.findMany({
            where: { userId: session.user.id }
        });
        return NextResponse.json(todos);
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role || "user";

    // RULE: Create Todos 
    // User -> Yes
    // Manager/Admin -> No
    if (role !== "user") {
        return NextResponse.json({ error: "Only Users can create todos" }, { status: 403 });
    }

    const body = await req.json();

    const newTodo = await prisma.todo.create({
        data: {
            title: body.title,
            description: body.description, // Added field
            status: "draft", // Default per requirements
            userId: session.user.id
        }
    });

    return NextResponse.json(newTodo);
}