import { checkMyPocketSkill } from "@/app/actions/mps";

export async function POST(req: Request) {
   try {
      const result = await checkMyPocketSkill();
      return Response.json({ success: result }, { status: 200 });
   } catch (err) {
      console.error(err);
      return Response.json({ success: false }, { status: 500 });
   }
}