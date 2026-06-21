import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const waitForSession = () => {
      return new Promise((resolve, reject) => {
        let timeoutId;
        let authListener;

        // Set a 10-second timeout
        timeoutId = setTimeout(() => {
          if (authListener) authListener.subscription.unsubscribe();
          reject(new Error("Session confirmation timed out. Please try logging in again."));
        }, 10000);

        // Listen for auth state changes (more reliable on mobile)
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            clearTimeout(timeoutId);
            if (data?.subscription) data.subscription.unsubscribe();
            resolve(session);
          }
        });
        authListener = data;

        // Also check getSession immediately in case it's already established
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (session && !error) {
            clearTimeout(timeoutId);
            if (authListener) authListener.subscription.unsubscribe();
            resolve(session);
          }
        }).catch(console.error);
      });
    };

    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const hasHashToken = window.location.hash.includes('access_token=');
        
        console.log("[OAuthCallback] 1. Extracted OAuth code:", { hasCode: !!code, hasHashToken });

        if (!code && !hasHashToken) {
          throw new Error("No authentication code or token found in the URL.");
        }

        if (code) {
          console.log("[OAuthCallback] 2. Exchanging code for session...");
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[OAuthCallback] Exchange error:", exchangeError);
            throw new Error(exchangeError.message || "Failed to exchange authentication code.");
          }
          console.log("[OAuthCallback] Code exchanged successfully.");
        }

        console.log("[OAuthCallback] 3. Waiting for session confirmation...");
        const session = await waitForSession();

        if (session) {
          console.log("[OAuthCallback] 4. Session confirmed, redirecting to home.");
          navigate('/');
        } else {
          throw new Error("Failed to confirm session after authentication.");
        }
      } catch (err) {
        console.error('[OAuthCallback] Callback error:', err);
        setErrorMsg(err.message || "An unexpected error occurred during sign in.");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center max-w-md w-full bg-slate-900 p-8 rounded-xl border border-slate-800">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
          <p className="text-slate-400 mb-6">{errorMsg}</p>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-amber-600 hover:bg-amber-700 text-white w-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center max-w-md w-full">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-white mb-3">Authenticating</h2>
        <p className="text-slate-400 font-medium leading-relaxed">
          Completing sign in...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;