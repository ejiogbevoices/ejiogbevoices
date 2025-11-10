import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  recordingId: string;
  recordingTitle: string;
  recordingUrl?: string;
}

export function ShareButton({ recordingId, recordingTitle, recordingUrl }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = recordingUrl || `${window.location.origin}/recordings/${recordingId}`;
  const shareText = `Check out this recording: ${recordingTitle}`;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(recordingTitle)}&body=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
        break;
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
    setShowMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Share2 size={18} />
        Share
      </Button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50 min-w-48">
          <button
            onClick={() => handleShare("facebook")}
            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded transition"
          >
            <Facebook size={18} className="text-blue-600" />
            <span>Facebook</span>
          </button>

          <button
            onClick={() => handleShare("twitter")}
            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded transition"
          >
            <Twitter size={18} className="text-blue-400" />
            <span>Twitter</span>
          </button>

          <button
            onClick={() => handleShare("whatsapp")}
            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded transition"
          >
            <MessageCircle size={18} className="text-green-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare("email")}
            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded transition"
          >
            <span>✉️</span>
            <span>Email</span>
          </button>

          <div className="border-t border-border my-2"></div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded transition"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
