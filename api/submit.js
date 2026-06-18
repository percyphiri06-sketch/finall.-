// ==========================================================================
// TELEGRAM PRODUCTION ENGINE HOOK (Node.js 18+ Runtime)
// File Location: /api/submit.js
// ==========================================================================

export default async function handler(req, res) {
    // 1. CONFIGURE RIGOROUS CORS SECURITY WALLS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. INTERCEPT AND SOLVE BROWSER OPTIONS HANDSHAKE (PREFLIGHT)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. REJECT UNWANTED TRAFFIC METHODS
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: `Method ${req.method} Not Allowed. Use POST.` 
        });
    }

    // 4. RETRIEVE ENVIRONMENT VARIABLES FROM VERCEL VAULT
    const token = process.env.8852827750:AAGe5kt937mGqJuEbILdVbUmZPWnemrjSZA;
    const chatId = process.env.8524294724;
    const { message } = req.body;

    // 5. VALIDATE ENGINE CONFIGURATIONS BEFORE RUNNING NETWORK TASKS
    if (!token || !chatId) {
        console.error("🚨 Vercel Environment Variables Configuration Missing!");
        return res.status(500).json({ 
            success: false, 
            error: "Server configuration issue: Secret keys are missing on the host platform." 
        });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            error: "Bad Request: Message content payload data is empty or invalid." 
        });
    }

    try {
        // 6. DISPATCH ASYNC PAYLOAD STEP STRAIGHT TO TELEGRAM SERVERS
        const telegramEndpoint = `https://api.telegram.org/bot${token}/sendMessage`;
        
        const telegramResponse = await fetch(telegramEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });

        const responseData = await telegramResponse.json();
        
        // 7. EVALUATE RESPONSE FROM TELEGRAM
        if (responseData.ok) {
            return res.status(200).json({ 
                success: true, 
                message_id: responseData.result.message_id 
            });
        } else {
            console.error("❌ Telegram API Rejection:", responseData.description);
            return res.status(400).json({ 
                success: false, 
                error: `Telegram Error: ${responseData.description}` 
            });
        }

    } catch (networkError) {
        // 8. CATCH UNEXPECTED NETWORK LOSSES OR TIMEOUTS
        console.error("🚨 Critical Infrastructure Pipeline Error:", networkError.message);
        return res.status(500).json({ 
            success: false, 
            error: `Internal Gateway Pipeline Failure: ${networkError.message}` 
        });
    }
      }
          
