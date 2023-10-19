import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { uuidv4 } from "@firebase/util";
import { APP_CONFIG } from "@/config/app";
import { writeToFirestoreDB } from "@/lib/firebase/firestore";

export async function POST(request: NextRequest) {
  const payload = await request.formData();
  const uid = payload.get("uid");
  const comment = payload.get("comment");
  const image = payload.get("image") as unknown as File;
  const attachment = payload.get("attachment") as unknown as File;
  const documentId = uuidv4();

  const files = [];
  if (!uid) return;

  if (image) {
    files.push({
      name: image.name,
      file: image,
      type: "images",
    });
  }

  if (attachment) {
    files.push({
      name: attachment.name,
      file: attachment,
      type: "attachments",
    });
  }

  const form = new FormData();
  files.forEach(({ file, type }) => form.append(type, file));

  await sendFilesToWorker(form, String(uid), documentId);

  await writeToFirestoreDB("testimonies", { comment, uid }, documentId);

  return new NextResponse(
    JSON.stringify({
      customClaims: `user.customClaims`,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}

async function sendFilesToWorker(
  form: FormData,
  uid: string,
  documentId: string
) {
  let result: any = null;
  let error: any = null;
  try {
    const header = String(process.env.WORKER_AUTH_SECRET_HEADER);
    const value = process.env.WORKER_AUTH_SECRET_KEY;
    const url = String(APP_CONFIG.WORKER_API_URL);

    result = await axios.put(`${url}/?uid=${uid}&documentId=${documentId}`, form, {
      headers: {
        // 'Content-type': 'multipart/form-data',
        [header]: value,
      } as any,
    });
    console.log(result)
  } catch (e) {
    console.log(e);
    error = e;
  }

  return { result, error };
}
