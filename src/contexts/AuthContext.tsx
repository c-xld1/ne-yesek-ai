import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
    id: string;
    email: string;
    username?: string;
    fullname?: string;
    avatar_url?: string;
    user_group?: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, username: string, fullname: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Login fonksiyonu - Kullanıcı adı veya e-posta ile giriş destekler
    const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        let email = identifier;
        // Eğer identifier e-posta formatında değilse, username olarak id ve email bul
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
            // username ile id bul
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', identifier)
                .single();
            if (profileError || !profile?.id) {
                setLoading(false);
                return { success: false, error: 'Kullanıcı adı veya e-posta bulunamadı.' };
            }
            // id ile Supabase Auth'dan email bul
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
            if (userError || !userData?.user?.email) {
                setLoading(false);
                return { success: false, error: 'Kullanıcı e-posta bilgisi bulunamadı.' };
            }
            email = userData.user.email;
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
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('username, fullname, avatar_url, user_group')
                .eq('id', data.user.id)
                .single();
            setUser({
                id: data.user.id,
                email: data.user.email!,
                username: profile?.username,
                fullname: profile?.fullname,
                avatar_url: profile?.avatar_url,
                user_group: profile?.user_group,
            });
        }
        setLoading(false);
        return { success: true };
    };
    const signUp = async (email: string, password: string, username: string, fullname: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            console.log('AuthContext signUp called with:', { email, username, fullname });
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: fullname, username }
                }
            });
            console.log('supabase.auth.signUp response:', { data, error });
            if (error) {
                console.error('SignUp error:', error);
                return { success: false, error: error.message };
            }
            // Manuel olarak profile oluştur (session olmasa bile)
            const profileData = { id: data.user!.id, username, fullname, user_group: 'Herkes' };
            const { data: insertedProfile, error: profileError } = await supabase
                .from('profiles')
                .insert(profileData)
                .select();
            console.log('Profile insert (manual):', { insertedProfile, profileError });
            if (profileError) {
                console.error('Profile insert error:', profileError);
                return { success: false, error: profileError.message };
            }
            // Set user in context
            setUser({ id: data.user!.id, email: data.user!.email!, username, fullname });
            return { success: true };
        } catch (err) {
            console.error('SignUp catch error:', err);
            return { success: false, error: 'Beklenmeyen hata' };
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

    useEffect(() => {
        // Mevcut oturumu kontrol et
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Profile bilgilerini al
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username, fullname, avatar_url, user_group')
                    .eq('id', session.user.id)
                    .single();

                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    username: profile?.username,
                    fullname: profile?.fullname,
                    avatar_url: profile?.avatar_url,
                    user_group: profile?.user_group,
                });
            }
        };

        getSession();

        // Auth state değişikliklerini dinle
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username, fullname, avatar_url, user_group')
                        .eq('id', session.user.id)
                        .single();

                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        username: profile?.username,
                        fullname: profile?.fullname,
                        avatar_url: profile?.avatar_url,
                        user_group: profile?.user_group,
                    });
                } else {
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>
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
