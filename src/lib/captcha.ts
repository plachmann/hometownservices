const CAPTCHA_PROVIDER = process.env.CAPTCHA_PROVIDER || "turnstile";
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET_KEY || "";

interface CaptchaVerifyResponse {
  success: boolean;
  error?: string;
}

export async function verifyCaptcha(token: string): Promise<CaptchaVerifyResponse> {
  if (!CAPTCHA_SECRET) {
    // Skip verification in development if no secret configured
    if (process.env.NODE_ENV === "development") {
      console.warn("CAPTCHA_SECRET_KEY not configured, skipping verification in development");
      return { success: true };
    }
    return { success: false, error: "CAPTCHA not configured" };
  }

  if (!token) {
    return { success: false, error: "CAPTCHA token required" };
  }

  try {
    let verifyUrl: string;
    let body: Record<string, string>;

    if (CAPTCHA_PROVIDER === "hcaptcha") {
      verifyUrl = "https://hcaptcha.com/siteverify";
      body = {
        secret: CAPTCHA_SECRET,
        response: token,
      };
    } else {
      // Default to Cloudflare Turnstile
      verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
      body = {
        secret: CAPTCHA_SECRET,
        response: token,
      };
    }

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data["error-codes"]?.join(", ") || "Verification failed",
    };
  } catch (error) {
    console.error("CAPTCHA verification error:", error);
    return { success: false, error: "Verification service unavailable" };
  }
}
