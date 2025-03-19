
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailConfirmationRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: EmailConfirmationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "CoinJar <noreply@coinjar.com>",
      to: [email],
      subject: "Welcome to CoinJar - Email Confirmation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CoinJar</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4F46E5 0%, #7E57C2 100%);
              padding: 30px 0;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header img {
              width: 140px;
              height: auto;
            }
            .content {
              background-color: #ffffff;
              padding: 40px 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #4F46E5 0%, #7E57C2 100%);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 50px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #888;
              font-size: 12px;
            }
            .signature {
              margin-top: 30px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            h1 {
              color: #2d3748;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">CoinJar</h1>
            </div>
            <div class="content">
              <h2>Welcome to CoinJar, ${name}!</h2>
              <p>Thank you for joining the CoinJar family! We're excited to have you on board.</p>
              <p>Your account has been created successfully. You're now part of a community that values financial freedom and innovative solutions for managing digital assets.</p>
              <p>To start exploring CoinJar, please click the button below to confirm your email:</p>
              <a href="#confirmation_link" class="button">Confirm My Email</a>
              <p>If you didn't create an account with us, please disregard this email.</p>
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>The CoinJar Team</strong></p>
                <p style="color: #666;">Empowering your financial future</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2023 CoinJar. All rights reserved.</p>
              <p>123 Financial District, Suite 456, San Francisco, CA 94111</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
