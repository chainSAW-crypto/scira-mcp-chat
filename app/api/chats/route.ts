import { NextResponse } from "next/server";
import { getChats, saveChat } from "@/lib/chat-store";

export async function GET(request: Request) {
  try {    
    const userId = request.headers.get('x-user-id');
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const chats = await getChats(userId, projectId);
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { id, title, projectId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    // Save the new chat
    const result = await saveChat({
      id,
      userId,
      projectId,
      title: title || 'New Chat',
      messages: []
    });

    return NextResponse.json({ success: true, chatId: result.id });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}