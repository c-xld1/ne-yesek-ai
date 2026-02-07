import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
    id: string;
    email: string;
    username?: string;
    fullname?: string;
    avatar_url?: string;
    cover_image?: string;
    bio?: string;
    location?: string;
    website?: string;
    website_url?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, username: string, fullname: string) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Login fonksiyonu - Kullanıcı adı veya e-posta ile giriş destekler
    const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        let email = identifier;
        
        // Eğer identifier e-posta formatında değilse, username olarak email'i bul
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
            // Security fix: Query profiles table directly (RLS allows public read)
            // instead of using admin API which requires service role key
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('username', identifier)
                .single();
                
            if (profileError || !profile) {
                setLoading(false);
                return { success: false, error: 'Kullanıcı adı bulunamadı.' };
            }
            
            // profiles table should have email column - if not, user needs to login with email
            if (!profile.email) {
                setLoading(false);
                return { success: false, error: 'Lütfen e-posta adresinizle giriş yapın.' };
            }
            
            email = profile.email;
        }
        
        let loginResponse;
        try {
            loginResponse = await supabase.auth.signInWithPassword({ email, password });
        } catch (signInError) {
            setLoading(false);
            return { success: false, error: 'Giriş API çağrısı reddedildi' };
        }
        const { data, error } = loginResponse;
        if (error) {
            let message = error.message;
            if (message.toLowerCase().includes('invalid login credentials')) {
                message = 'Kullanıcı adı/e-posta veya şifre hatalı.';
            }
            if (message.toLowerCase().includes('email not confirmed')) {
                message = 'Lütfen e-posta adresinizi onaylayın.';
            }
            setLoading(false);
            return { success: false, error: message };
        }
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, fullname, avatar_url, bio')
                .eq('id', data.user.id)
                .single();
            const p = profile as any;
            setUser({
                id: data.user.id,
                email: data.user.email!,
                username: p?.username,
                fullname: p?.fullname,
                avatar_url: p?.avatar_url,
                bio: p?.bio,
            });
        }
        setLoading(false);
        return { success: true };
    };

    const signUp = async (email: string, password: string, username: string, fullname: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/`,
                    data: { 
                        username,
                        fullname
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (!data.user) {
                return { success: false, error: 'Kullanıcı oluşturulamadı' };
            }

            // Trigger otomatik profile oluşturacak, bekleyelim
            await new Promise(resolve => setTimeout(resolve, 1000));

            return { success: true };
        } catch (err: any) {
            console.error('SignUp error:', err);
            return { success: false, error: err?.message || 'Kayıt sırasında hata oluştu' };
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error: any) {
            console.error('Google login error:', error);
            return { success: false, error: 'Google ile giriş yapılamadı' };
        } finally {
            setLoading(false);
        }
    };

    const signInWithFacebook = async (): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error: any) {
            console.error('Facebook login error:', error);
            return { success: false, error: 'Facebook ile giriş yapılamadı' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('username, fullname, avatar_url, bio')
                .eq('id', session.user.id)
                .maybeSingle();
            const p = profile as any;

            // Eğer profil yoksa ve hata PGRST116 ise (no rows), profil oluştur
            if (!profile && (!error || error.code === 'PGRST116')) {
                console.log('Creating missing profile for user:', session.user.id);
                const { data: newProfile } = await supabase
                    .from('profiles')
                    .insert({
                        id: session.user.id,
                        username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`,
                        fullname: session.user.user_metadata?.fullname || session.user.email?.split('@')[0] || "Yeni Kullanıcı",
                        email: session.user.email,
                        bio: "",
                        avatar_url: "",
                    } as any)
                    .select('username, fullname, avatar_url, bio')
                    .single();
                const np = newProfile as any;

                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    username: np?.username,
                    fullname: np?.fullname,
                    avatar_url: np?.avatar_url,
                    bio: np?.bio
                });
                return;
            }

            setUser({
                id: session.user.id,
                email: session.user.email!,
                username: p?.username,
                fullname: p?.fullname,
                avatar_url: p?.avatar_url,
                bio: p?.bio
            });
        }
    };

    useEffect(() => {
        let mounted = true;

        // Auth state listener'ı ÖNCE ayarla
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!mounted) return;

                if (session?.user) {
                    // Defer profile fetch to avoid blocking auth state change
                    setTimeout(() => {
                        supabase
                            .from('profiles')
                            .select('username, fullname, avatar_url, bio')
                            .eq('id', session.user.id)
                            .maybeSingle()
                            .then(async ({ data: profile, error }) => {
                                if (!mounted) return;
                                const p = profile as any;

                                // Eğer profil yoksa oluştur
                                if (!profile && (!error || error.code === 'PGRST116')) {
                                    const { data: newProfile } = await supabase
                                        .from('profiles')
                                        .insert({
                                            id: session.user.id,
                                            username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`,
                                            fullname: session.user.user_metadata?.fullname || session.user.email?.split('@')[0] || "Yeni Kullanıcı",
                                            email: session.user.email,
                                            bio: "",
                                            avatar_url: "",
                                        } as any)
                                        .select('username, fullname, avatar_url, bio')
                                        .single();
                                    const np = newProfile as any;

                                    setUser({
                                        id: session.user.id,
                                        email: session.user.email!,
                                        username: np?.username,
                                        fullname: np?.fullname,
                                        avatar_url: np?.avatar_url,
                                        bio: np?.bio
                                    });
                                } else {
                                    setUser({
                                        id: session.user.id,
                                        email: session.user.email!,
                                        username: p?.username,
                                        fullname: p?.fullname,
                                        avatar_url: p?.avatar_url,
                                        bio: p?.bio
                                    });
                                }
                                setLoading(false);
                            });
                    }, 0);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            }
        );

        // SONRA mevcut session'ı kontrol et
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;

            if (session?.user) {
                setTimeout(() => {
                    supabase
                        .from('profiles')
                        .select('username, fullname, avatar_url, bio')
                        .eq('id', session.user.id)
                        .maybeSingle()
                        .then(async ({ data: profile, error }) => {
                            if (!mounted) return;
                            const p = profile as any;

                            // Eğer profil yoksa oluştur
                            if (!profile && (!error || error.code === 'PGRST116')) {
                                const { data: newProfile } = await supabase
                                    .from('profiles')
                                    .insert({
                                        id: session.user.id,
                                        username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`,
                                        fullname: session.user.user_metadata?.fullname || session.user.email?.split('@')[0] || "Yeni Kullanıcı",
                                        email: session.user.email,
                                        bio: "",
                                        avatar_url: "",
                                    } as any)
                                    .select('username, fullname, avatar_url, bio')
                                    .single();
                                const np = newProfile as any;

                                setUser({
                                    id: session.user.id,
                                    email: session.user.email!,
                                    username: np?.username,
                                    fullname: np?.fullname,
                                    avatar_url: np?.avatar_url,
                                    bio: np?.bio
                                });
                            } else {
                                setUser({
                                    id: session.user.id,
                                    email: session.user.email!,
                                    username: p?.username,
                                    fullname: p?.fullname,
                                    avatar_url: p?.avatar_url,
                                    bio: p?.bio
                                });
                            }
                            setLoading(false);
                        });
                }, 0);
            } else {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

  return (
    <AuthContext.Provider value={{ user, login, signUp, signInWithGoogle, signInWithFacebook, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
