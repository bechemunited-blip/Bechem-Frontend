/**
 * BUFC Newsletter Welcome Email Template
 * Branded with club colors and modern aesthetic
 */
export const getWelcomeEmailHtml = (email: string) => {
    const primaryPurple = "#3f2a78";
    const accentGold = "#c5a059"; // A gold accent color for premium feel
    const lightBg = "#f1eff6";
    const white = "#ffffff";
    const textColor = "#1d0c40";
    const mutedText = "#6e609c";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Hunters Pack</title>
    <style>
        body { margin: 0; padding: 0; background-color: ${lightBg}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: ${textColor}; }
        .container { max-width: 600px; margin: 40px auto; background-color: ${white}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(63, 42, 120, 0.1); }
        .header { background-color: ${primaryPurple}; padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: auto; margin-bottom: 20px; }
        .content { padding: 40px; text-align: center; }
        .headline { font-size: 28px; font-weight: 700; color: ${primaryPurple}; margin-bottom: 16px; letter-spacing: -0.5px; }
        .subheadline { font-size: 16px; color: ${mutedText}; line-height: 1.6; margin-bottom: 32px; }
        .button { display: inline-block; padding: 14px 32px; background-color: ${primaryPurple}; color: ${white} !important; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; transition: transform 0.2s; }
        .features { padding: 30px; background-color: #faf9ff; margin: 0 40px 40px; border-radius: 12px; text-align: left; }
        .feature-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .feature-icon { color: ${accentGold}; margin-right: 12px; font-size: 18px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: ${mutedText}; border-top: 1px solid #eee; }
        .social-links { margin-bottom: 20px; }
        .social-link { margin: 0 10px; color: ${primaryPurple}; text-decoration: none; font-weight: 600; }
        @media only screen and (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content { padding: 30px 20px; }
            .headline { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <!-- Ideally this would be a public absolute URL to the logo -->
            <img src="https://raw.githubusercontent.com/Mckay-z/BUFC_website/main/public/img/bufc_logo.png" alt="BUFC Logo" class="logo">
            <div style="color: ${white}; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Bechem United FC</div>
        </div>

        <!-- Content -->
        <div class="content">
            <h1 class="headline">You're in, Hunter! 🦁</h1>
            <p class="subheadline">
                Welcome to the official Bechem United FC newsletter. You've just joined a community of dedicated fans who live and breathe <strong>The Hunters Mentality</strong>.
            </p>
            
            <a href="https://bechemunitedfc.com" class="button">Visit Our Home Ground</a>
        </div>

        <!-- What to expect -->
        <div class="features">
            <div style="font-weight: 700; margin-bottom: 15px; color: ${primaryPurple}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">What you'll receive:</div>
            
            <div class="feature-item">
                <span class="feature-icon">⚽</span>
                <span><strong>Matchday Coverage:</strong> Exclusive lineups, live updates and post-match analysis.</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">🎟️</span>
                <span><strong>Priority Access:</strong> Be the first to know about ticket releases and match schedules.</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">👕</span>
                <span><strong>Exclusive Offers:</strong> Special discounts on new jersey launches and club merchandise.</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="social-links">
                <a href="https://twitter.com/bechemunitedfc" class="social-link">X / Twitter</a>
                <a href="https://facebook.com/bechemunitedfc" class="social-link">Facebook</a>
                <a href="https://instagram.com/bechemunitedfc" class="social-link">Instagram</a>
            </div>
            <p>&copy; ${new Date().getFullYear()} Bechem United Football Club. All rights reserved.</p>
            <p>You received this because you subscribed to the BUFC newsletter with ${email}.</p>
            <p style="margin-top: 10px;"><a href="#" style="color: ${mutedText}; text-decoration: underline;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
  `;
};
