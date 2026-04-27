<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  let isOpen = $state(false);
  let inputMessage = $state('');
  
  type Message = { role: 'user' | 'ai', content: string };
  let messages = $state<Message[]>([
    { role: 'ai', content: '¡Hola! Soy el doble digital de Carlos. ¿Qué te gustaría saber sobre su experiencia o habilidades?' }
  ]);
  let isTyping = $state(false);
  
  let messageCount = $state(0);
  const MAX_MESSAGES = 5;

  onMount(() => {
    const stored = localStorage.getItem('chat_message_count');
    if (stored) messageCount = parseInt(stored, 10);
    
    if (messageCount >= MAX_MESSAGES) {
      messages.push({ 
        role: 'ai', 
        content: "Has alcanzado el límite de mensajes de demostración. Si deseas saber más, ¡envíale un email a Carlos!" 
      });
    }
  });

  async function sendMessage() {
    if (!inputMessage.trim() || messageCount >= MAX_MESSAGES) return;
    
    messageCount++;
    localStorage.setItem('chat_message_count', messageCount.toString());

    messages.push({ role: 'user', content: inputMessage });
    inputMessage = '';
    isTyping = true;

    try {
      // Mapear los roles de la UI al formato esperado por la API (ai -> assistant)
      const apiMessages = messages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : m.role,
        content: m.content
      }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });
      
      const data = await res.json();

      // Si el servidor (KV) devuelve un 429, significa que nos han pillado saltándonos el localStorage
      if (res.status === 429) {
        messages.push({ role: 'ai', content: data.response });
        messageCount = MAX_MESSAGES;
        localStorage.setItem('chat_message_count', MAX_MESSAGES.toString());
        return;
      }

      if (!res.ok) throw new Error('Error al conectar con la IA');
      
      messages.push({ role: 'ai', content: data.response });
      
      // Sincronizar contador real que viene del servidor si es posible
      if (data.limit) {
         messageCount = data.limit;
         localStorage.setItem('chat_message_count', messageCount.toString());
      }
      
      if (messageCount >= MAX_MESSAGES) {
        setTimeout(() => {
          messages.push({ 
            role: 'ai', 
            content: "Has agotado tus 5 mensajes gratuitos de demostración. ¡Contáctame por correo o LinkedIn para continuar la charla!" 
          });
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      messages.push({ 
        role: 'ai', 
        content: "Ups, parece que mis circuitos de IA están desconectados en este momento. Intenta contactar a Carlos directamente en su email." 
      });
    } finally {
      isTyping = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="digital-double-container">
  {#if isOpen}
    <div class="chat-window" transition:slide={{ duration: 300, axis: 'y' }}>
      <div class="chat-header">
        <div class="avatar">
          <!-- Placeholder avatar, you can replace with Carlos's actual photo -->
          <img src="/design/logo-mark.svg" alt="Carlos AI" />
        </div>
        <div>
          <h4>Carlos (AI)</h4>
          <span class="status">En línea</span>
        </div>
        <button class="close-btn" onclick={() => isOpen = false} aria-label="Cerrar chat">✕</button>
      </div>
      
      <div class="chat-messages">
        {#each messages as msg}
          <div class="message {msg.role}">
            {msg.content}
          </div>
        {/each}
        {#if isTyping}
          <div class="message ai typing">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        {/if}
      </div>

      <div class="chat-input-area">
        <input 
          type="text" 
          bind:value={inputMessage} 
          onkeydown={handleKeydown}
          placeholder={messageCount >= MAX_MESSAGES ? "Límite de mensajes alcanzado" : "Pregúntame algo..."}
          disabled={messageCount >= MAX_MESSAGES || isTyping}
        />
        <button onclick={sendMessage} disabled={!inputMessage.trim() || isTyping || messageCount >= MAX_MESSAGES} aria-label="Enviar mensaje">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <button class="toggle-btn" class:open={isOpen} onclick={() => isOpen = !isOpen} aria-label="Abrir doble digital">
    {#if isOpen}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
    {:else}
      <!-- Sparkles icon for AI -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.3-4.3"/><path d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="m14 14-3-3"/><path d="m11 11-3-3"/></svg>
    {/if}
  </button>
</div>

<style>
  .digital-double-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: var(--z-modal);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }

  .toggle-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--bg-elevated);
    color: var(--neon-cyan);
    border: 1px solid var(--border-strong);
    box-shadow: var(--shadow-md), var(--glow-cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s var(--ease-spring), background 0.3s, color 0.3s, box-shadow 0.3s;
    cursor: none; /* handled by our global custom cursor */
  }

  .toggle-btn:not(.open) {
    animation: attention-pulse 2.5s infinite;
  }

  @keyframes attention-pulse {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--neon-cyan) 60%, transparent), var(--shadow-md), var(--glow-cyan);
    }
    70% {
      box-shadow: 0 0 0 20px color-mix(in srgb, var(--neon-cyan) 0%, transparent), var(--shadow-md), var(--glow-cyan);
    }
    100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--neon-cyan) 0%, transparent), var(--shadow-md), var(--glow-cyan);
    }
  }

  .toggle-btn:hover {
    transform: scale(1.08) translateY(-4px);
    background: var(--neon-cyan);
    color: var(--obsidian-950);
    animation: none;
    box-shadow: var(--shadow-lg), 0 0 20px color-mix(in srgb, var(--neon-cyan) 80%, transparent);
  }
  .toggle-btn svg { width: 28px; height: 28px; }

  .chat-window {
    width: 360px;
    height: 520px;
    max-height: calc(100vh - 120px);
    background: var(--bg-overlay);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: color-mix(in srgb, var(--obsidian-950) 80%, transparent);
    border-bottom: 1px solid var(--border);
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--border-accent);
    background: var(--obsidian-800);
    padding: 6px;
  }
  .avatar img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 4px var(--neon-cyan)); }
  .chat-header h4 { margin: 0; font-size: 15px; color: var(--fg); font-family: var(--font-display); }
  .status { font-size: 12px; color: var(--neon-cyan); display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); }
  .status::before { content: ''; width: 6px; height: 6px; background: var(--neon-cyan); border-radius: 50%; display: inline-block; box-shadow: var(--glow-cyan); }
  .close-btn { margin-left: auto; background: none; border: none; color: var(--fg-muted); font-size: 18px; transition: color 0.2s; cursor: none; }
  .close-btn:hover { color: var(--fg); }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    /* Hide scrollbar */
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) transparent;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

  .message {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: var(--radius-lg);
    font-size: 14px;
    line-height: 1.5;
  }
  .message.ai {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--fg);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .message.user {
    background: var(--neon-cyan);
    color: var(--obsidian-950);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    font-weight: 500;
  }

  .typing { display: flex; gap: 4px; padding: 12px 16px; align-items: center; }
  .dot { width: 6px; height: 6px; background: var(--fg-muted); border-radius: 50%; animation: pulse 1.4s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }

  .chat-input-area {
    display: flex;
    padding: 16px;
    gap: 10px;
    background: color-mix(in srgb, var(--obsidian-950) 60%, transparent);
    border-top: 1px solid var(--border);
  }
  .chat-input-area input {
    flex: 1;
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    padding: 10px 18px;
    color: var(--fg);
    font-family: var(--font-sans);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .chat-input-area input:focus { border-color: var(--neon-cyan); box-shadow: inset 0 0 0 1px var(--neon-cyan); }
  .chat-input-area button {
    background: var(--neon-cyan);
    color: var(--obsidian-950);
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, transform 0.2s;
    cursor: none;
    flex-shrink: 0;
  }
  .chat-input-area button:hover:not(:disabled) { transform: scale(1.05); }
  .chat-input-area button:disabled { opacity: 0.5; }
  .chat-input-area button svg { width: 18px; height: 18px; }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 32px);
      position: fixed;
      bottom: 96px;
      right: 16px;
      height: 65vh;
    }
  }
</style>
