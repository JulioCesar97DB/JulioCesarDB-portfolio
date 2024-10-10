// src/pages/api/notify.ts
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
    const data = await request.json();
    const { message } = data;

    // Aquí llamamos a la función que envía el mensaje a Telegram
    await sendMessageToTelegram(`Nueva visita: ${message}`);

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

async function sendMessageToTelegram(message: string) {
    const TELEGRAM_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    });

    return response.json();
}
