interface Env {
  AI: any;
  CHAT_LIMITS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    // 1. Identificar al usuario por su IP (Cloudflare provee esta cabecera)
    const clientIP = request.headers.get('CF-Connecting-IP') || 'ip-local-dev';
    const kvKey = `chat_limit_${clientIP}`;
    const MAX_MESSAGES = 5;

    // 2. Comprobar cuántos mensajes ha enviado esta IP
    const currentCountStr = await env.CHAT_LIMITS.get(kvKey);
    let currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;

    // 3. Si se pasa de la raya, bloqueamos la petición en el servidor
    if (currentCount >= MAX_MESSAGES) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        response: 'Has alcanzado el límite de 5 mensajes por servidor. ¡Contáctame por email para continuar la charla!' 
      }), { 
        status: 429, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const body = await request.json() as { messages: { role: string, content: string }[] };
    
    if (!body.messages) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), { status: 400 });
    }

    // Contexto del sistema para inyectar la personalidad de Carlos
    const systemPrompt = {
      role: 'system',
      content: `Eres el Doble Digital de Carlos Ledesma Castejón, un Tech Lead y Arquitecto de Software con más de 13 años de experiencia en QA, Estrategia de IA y Desarrollo Full-Stack.
Tu objetivo es responder a reclutadores, desarrolladores o clientes potenciales sobre la experiencia y habilidades de Carlos.
Actúa de manera profesional, amable, humilde y un poco geek.
Responde SIEMPRE de forma concisa y directa (máximo 2 o 3 frases). Usa emojis ocasionalmente.
Habilidades clave de Carlos: Svelte, SvelteKit, TypeScript, Python, Cloud Architecture, QA Automation, IA.
Contacto: carlos.developer1983@gmail.com o a través del formulario de la web.
Eres un asistente conversacional. Preséntate como el doble digital o asistente de Carlos.`
    };

    const messages = [systemPrompt, ...body.messages];

    // Ejecutamos el modelo gratuito y rápido de Llama 3 en Workers AI
    const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: messages
    });

    // 4. Incrementar el contador en KV (expira en 24h)
    currentCount++;
    await env.CHAT_LIMITS.put(kvKey, currentCount.toString(), { expirationTtl: 86400 });

    return new Response(JSON.stringify({ 
      response: aiResponse.response,
      limit: currentCount
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};
