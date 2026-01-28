import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check and link partner invitation
  const checkAndLinkPartner = useCallback(async (currentUser: User) => {
    if (!currentUser.email) return;

    try {
      // Check if this user's email is in any couple_profiles as partner_email (pending invitation)
      const { data: invitations, error } = await supabase
        .from("couple_profiles")
        .select("id, user_id, partner_email")
        .eq("partner_email", currentUser.email)
        .is("partner_user_id", null);

      if (error) {
        console.error("Error checking partner invitations:", error);
        return;
      }

      if (invitations && invitations.length > 0) {
        // Link this user to the first invitation found
        const invitation = invitations[0];
        
        // Make sure user is not trying to link to their own profile
        if (invitation.user_id === currentUser.id) {
          console.log("Cannot link to own profile");
          return;
        }

        const { error: updateError } = await supabase
          .from("couple_profiles")
          .update({ partner_user_id: currentUser.id })
          .eq("id", invitation.id);

        if (updateError) {
          console.error("Error linking partner:", updateError);
        } else {
          console.log("Partner linked successfully!");
        }
      }

      // Also check if this user already has their own profile
      const { data: ownProfile } = await supabase
        .from("couple_profiles")
        .select("id")
        .eq("user_id", currentUser.id)
        .single();

      // If user doesn't have their own profile and is now a partner, they don't need one
      // But if they're not linked anywhere, they might need to create one (handled in signup)
      
    } catch (err) {
      console.error("Error in checkAndLinkPartner:", err);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check for partner linking on login
        if (session?.user && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
          // Use setTimeout to avoid potential race conditions with Supabase
          setTimeout(() => {
            checkAndLinkPartner(session.user);
          }, 100);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkAndLinkPartner(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAndLinkPartner]);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name },
      },
    });

    if (!error) {
      // Create couple profile after signup
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        // Check if user was invited as a partner first
        const { data: invitation } = await supabase
          .from("couple_profiles")
          .select("id")
          .eq("partner_email", email)
          .is("partner_user_id", null)
          .single();

        if (invitation) {
          // User was invited - link them and update partner name
          await supabase
            .from("couple_profiles")
            .update({ 
              partner_user_id: userData.user.id,
              partner_name: name 
            })
            .eq("id", invitation.id);
        } else {
          // User was not invited - create their own profile
          await supabase.from("couple_profiles").insert({
            user_id: userData.user.id,
            user_name: name,
            combined_income: 0,
          });
        }
      }
    }

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}