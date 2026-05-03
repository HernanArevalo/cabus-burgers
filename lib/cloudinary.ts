const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

function requireEnv(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

export async function uploadProductImage(file: File) {
  const cloudName = requireEnv(CLOUDINARY_CLOUD_NAME, "CLOUDINARY_CLOUD_NAME")

  const formData = new FormData()
  formData.append("file", file)
  if (process.env.CLOUDINARY_UPLOAD_PRESET) {
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET)
  }
  formData.append("folder", "cabus-burgers-app/products")

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Cloudinary upload failed: ${errorBody}`)
  }

  const payload = await response.json()
  return {
    url: payload.secure_url as string,
    publicId: payload.public_id as string,
  }
}

export async function deleteCloudinaryImageByPublicId(publicId: string) {
  const cloudName = requireEnv(CLOUDINARY_CLOUD_NAME, "CLOUDINARY_CLOUD_NAME")
  const apiKey = requireEnv(CLOUDINARY_API_KEY, "CLOUDINARY_API_KEY")
  const apiSecret = requireEnv(CLOUDINARY_API_SECRET, "CLOUDINARY_API_SECRET")

  const timestamp = Math.floor(Date.now() / 1000)
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const crypto = await import("crypto")
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex")

  const formData = new FormData()
  formData.append("public_id", publicId)
  formData.append("api_key", apiKey)
  formData.append("timestamp", String(timestamp))
  formData.append("signature", signature)

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Cloudinary delete failed: ${errorBody}`)
  }

  return response.json()
}

export function extractCloudinaryPublicId(imageUrl: string) {
  if (!imageUrl.includes("res.cloudinary.com")) return null

  const uploadMarker = "/upload/"
  const uploadIndex = imageUrl.indexOf(uploadMarker)
  if (uploadIndex === -1) return null

  const pathAfterUpload = imageUrl.slice(uploadIndex + uploadMarker.length)
  const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "")
  const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, "")

  return withoutExtension || null
}
