import { supabase } from '@/lib/customSupabaseClient';

export const AssistantService = {
  async generateResponse(userMessage, conversationHistory, userLanguage = 'en') {
    try {
      console.log('[AssistantService] Generating response...');
      
      // Configuration Verification Logs (Safe logging)
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasAnonKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      console.log(`[AssistantService] Config Check - URL exists: ${hasUrl}, Key exists: ${hasAnonKey}`);

      // 1. Input Validation
      if (!userMessage || userMessage.trim().length === 0) {
        throw new Error('Please ask me something!');
      }
      
      if (userMessage.length > 1000) {
        throw new Error('Message exceeds maximum length of 1000 characters. Please shorten your message.');
      }

      // Ensure language is one of the supported ones, default to 'en'
      const validLangs = ['en', 'sq', 'mk'];
      const lang = validLangs.includes(userLanguage?.toLowerCase()) ? userLanguage.toLowerCase() : 'en';

      // Prepare messages for server API (last 10 messages for context)
      // Filter out purely decorative or error messages if they exist, keep only role and content
      const recentHistory = conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const requestBody = {
        message: userMessage.trim(),
        conversationHistory: recentHistory,
        language: lang
      };

      // 2. Network Request via Supabase Edge Function
      console.log('[AssistantService] Sending POST request to Edge Function...');
      const { data, error } = await supabase.functions.invoke('ask-occasions', {
        body: requestBody
      });

      // 3. Error Handling
      if (error) {
        console.error('[AssistantService] Edge function invocation error:', error);
        
        if (error.message === 'Failed to send a request to the Edge Function') {
          throw new Error('NETWORK_ERROR');
        }

        const status = error.context?.status || error.status;
        
        if (status === 429) throw new Error('RATE_LIMIT');
        if (status === 503) throw new Error('SERVICE_UNAVAILABLE');
        if (status === 400) throw new Error('BAD_REQUEST');
        
        throw new Error(`SERVER_ERROR`);
      }

      console.log('[AssistantService] Received successful response');

      // 4. Response Parsing
      if (data && data.reply) {
        return data.reply;
      }

      if (data && data.error) {
        console.error('[AssistantService] API returned handled error:', data.error);
        throw new Error(data.error);
      }

      throw new Error('INVALID_RESPONSE');

    } catch (error) {
      console.error('[AssistantService] Handled Error:', error.message);
      
      // 5. User-friendly error messages
      if (error.message === 'Please ask me something!' || error.message.includes('maximum length')) {
        throw error; // Let the UI display these directly
      }

      if (error.message === 'RATE_LIMIT' || error.message?.includes('Rate limit')) {
        const rateLimitMsgs = {
          en: "I'm receiving too many requests right now. Please wait a moment and try again.",
          sq: "Po marr shumë kërkesa për momentin. Ju lutemi prisni pak dhe provoni përsëri.",
          mk: "Добивам премногу барања во моментов. Ве молиме почекајте малку и обидете се повторно."
        };
        throw new Error(rateLimitMsgs[userLanguage] || rateLimitMsgs.en);
      }
      
      if (error.message === 'NETWORK_ERROR') {
        throw new Error("Unable to connect to the assistant. Please check your internet connection.");
      }

      // Default fallback for SERVICE_UNAVAILABLE, SERVER_ERROR, BAD_REQUEST, INVALID_RESPONSE
      throw new Error(this.getFallbackMessage(userLanguage));
    }
  },

  getFallbackMessage(language) {
    const fallbacks = {
      en: "Assistant is temporarily unavailable. Please contact contact@occasions-gifts.com",
      sq: "Asistenti është përkohësisht i padisponueshëm. Ju lutemi kontaktoni contact@occasions-gifts.com",
      mk: "Асистентот е привремено недостапен. Ве молиме контактирајте contact@occasions-gifts.com"
    };
    return fallbacks[language] || fallbacks.en;
  }
};