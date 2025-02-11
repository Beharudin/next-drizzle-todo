import { db } from "@/app/db/db";
import { tasks } from "@/app/db/schema";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, userId } = await req.json();
    const newTask = await db.insert(tasks).values({ title, userId });
    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        userId: tasks.userId,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.userId, users.id));
    return NextResponse.json({ success: true, tasks: allTasks });
  } catch (error) {
    console.log(error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
