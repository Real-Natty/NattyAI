import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../services/api";
import {
  ImagePlus,
  Download,
  Sparkles,
  LoaderCircle,
  WandSparkles,
} from "lucide-react";

function ImageGenerator() {
  const { token } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setImage("");

    try {
      const response = await fetch(`${API_URL}/api/ai/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image generation failed.");
      }

      if (!data.image) {
        throw new Error("No image was returned by the AI.");
      }

      setImage(data.image);
    } catch (err) {
      console.error("Image generation error:", err);
      setError(err.message || "Unable to generate image.");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `nattyai-image-${Date.now()}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="image-studio">
      <div className="image-studio-heading">
        <div>
          <span className="image-studio-label">
            <Sparkles size={15} /> POWERED BY FLUX AI
          </span>

          <h1>Create images with AI</h1>

          <p>Turn your imagination into beautiful images with NattyAI.</p>
        </div>
      </div>

      <form className="image-prompt-card" onSubmit={handleGenerate}>
        <label htmlFor="imagePrompt">Describe the image you want</label>

        <textarea
          id="imagePrompt"
          placeholder="A futuristic African city at sunset, cinematic lighting, ultra-realistic photography..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={2048}
          rows={5}
          disabled={loading}
        />

        <div className="image-prompt-footer">
          <span>{prompt.length}/2048 characters</span>

          <button type="submit" disabled={!prompt.trim() || loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="image-loading-icon" />
                Creating...
              </>
            ) : (
              <>
                <WandSparkles size={18} />
                Generate Image
              </>
            )}
          </button>
        </div>
      </form>

      <div className="image-preview-card">
        {loading ? (
          <div className="image-empty-state">
            <LoaderCircle size={38} className="image-loading-icon" />
            <h3>Creating your image...</h3>
            <p>NattyAI is bringing your imagination to life.</p>
          </div>
        ) : image ? (
          <div className="generated-image-container">
            <img src={image} alt={prompt} />

            <div className="generated-image-footer">
              <span>Your generated image</span>

              <button onClick={downloadImage}>
                <Download size={17} />
                Download
              </button>
            </div>
          </div>
        ) : (
          <div className="image-empty-state">
            <div className="image-empty-icon">
              <ImagePlus size={35} />
            </div>

            <h3>Your creativity starts here</h3>

            <p>
              Describe your idea above and your generated image will appear
              here.
            </p>
          </div>
        )}
      </div>

      {error && <div className="image-error">{error}</div>}
    </section>
  );
}

export default ImageGenerator;
