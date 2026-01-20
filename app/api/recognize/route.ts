export async function POST(request: Request) {
  try {
    const { imageData } = await request.json()

    const response = await fetch("https://shapecatcher.com/engine/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `file=${encodeURIComponent(imageData)}`,
    })

    const html = await response.text()

    // Extract Unicode characters using regex (TypeScript equivalent of the Python code)
    const regex = /<span class='detail_character_unicode'[^>]*>([^<]+)<\/span>/g
    const unicodeChars: string[] = []
    let match

    while ((match = regex.exec(html)) !== null) {
      unicodeChars.push(match[1])
    }

    return Response.json({ characters: unicodeChars })
  } catch (error) {
    console.error("Error recognizing shape:", error)
    return Response.json({ error: "Failed to recognize shape" }, { status: 500 })
  }
}
