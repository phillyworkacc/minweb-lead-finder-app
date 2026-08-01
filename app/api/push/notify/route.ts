import { notifyClientAboutLeads } from "@/app/actions/notifications";
import { NextResponse } from "next/server";

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

export async function POST() {
   try {
      await notifyClientAboutLeads();
      return Response.json({ success: true }, { status: 200, headers: getCORSHeaders() });
   } catch (err) {
      return Response.json({ success: false }, { status: 500, headers: getCORSHeaders() });
   }
}