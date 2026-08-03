import { notifyClientAboutError } from "@/app/actions/notifications";
import { NextRequest, NextResponse } from "next/server";

const getCORSHeaders = () => {
   const headers = new Headers();
   headers.set('Access-Control-Allow-Origin', '*');
   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   return headers;
};

export async function OPTIONS() {
   return new NextResponse(null, {
      status: 204,
      headers: getCORSHeaders(),
   });
}

export async function POST(req: NextRequest) {
   try {
      const notificationInfo = await req.json();
      await notifyClientAboutError(notificationInfo);
      return Response.json({ success: true }, { status: 200, headers: getCORSHeaders() });
   } catch (err) {
      return Response.json({ success: false }, { status: 500, headers: getCORSHeaders() });
   }
}