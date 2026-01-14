import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role || "user";

    // 1. CHECK if the Todo exists FIRST
    const todo = await prisma.todo.findUnique({ where: { id } });

    // If it doesn't exist, return 404 immediately
    if (!todo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // 2. CHECK Permissions (ABAC)
    if (role !== "user") {
        return NextResponse.json({ error: "Only Users can update todos" }, { status: 403 });
    }

    if (todo.userId !== session.user.id) {
        return NextResponse.json({ error: "You do not own this todo" }, { status: 403 });
    }

    // 3. UPDATE safely
    const body = await req.json();
    const updatedTodo = await prisma.todo.update({
        where: { id },
        data: {
            title: body.title,
            description: body.description,
            status: body.status
        }
    });

    return NextResponse.json(updatedTodo);
}

// ... DELETE function remains the same ...
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    // ... (Use the DELETE code provided previously) ...
    // Just ensure you add the "const { id } = await params;" line at the start.
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    // ... rest of logic
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role || "user";
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 1. Admin: Can delete ANY todo
    if (role === "admin") {
        await prisma.todo.delete({ where: { id } });
        return NextResponse.json({ success: true });
    }

    // 2. Manager: Cannot delete anything
    if (role === "manager") {
        return NextResponse.json({ error: "Managers cannot delete todos" }, { status: 403 });
    }

    // 3. User: Can delete OWN todo ONLY if status is 'draft'
    if (role === "user") {
        if (todo.userId !== session.user.id) {
            return NextResponse.json({ error: "You do not own this todo" }, { status: 403 });
        }

        if (todo.status !== "draft") {
            return NextResponse.json({ error: "ABAC Rule: You can only delete todos in 'draft' status" }, { status: 403 });
        }

        await prisma.todo.delete({ where: { id } });
        return NextResponse.json({ success: true });
    }
}