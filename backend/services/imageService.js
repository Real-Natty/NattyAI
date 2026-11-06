const MODEL = "@cf/black-forest-labs/flux-1-schnell";

async function generateImage(prompt) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials are missing.");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        steps: 4,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    console.error("Cloudflare error:", data);
    throw new Error(data.errors?.[0]?.message || "Image generation failed.");
  }

  const image = data.result?.image || data.result;

  if (!image || typeof image !== "string") {
    throw new Error("Cloudflare returned no image.");
  }

  return `data:image/jpeg;base64,${image}`;
}

module.exports = { generateImage };
