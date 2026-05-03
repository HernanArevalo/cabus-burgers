import { NextResponse } from "next/server"
import { uploadProductImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const uploaded = await uploadProductImage(file)
    return NextResponse.json(uploaded, { status: 201 })
  } catch (error) {
    console.error("Error uploading product image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
