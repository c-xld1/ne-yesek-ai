// Test kullanıcısı oluşturma scripti
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
    console.log('Test kullanıcısı oluşturuluyor...');
    
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@neyesek.com',
        password: 'admin123',
        options: {
            data: {
                username: 'admin',
                full_name: 'Admin Kullanıcı'
            }
        }
    });

    if (error) {
        console.error('Hata:', error);
    } else {
        console.log('Başarılı! Kullanıcı ID:', data.user?.id);
        console.log('Email:', data.user?.email);
        console.log('\nGiriş bilgileri:');
        console.log('Email: admin@neyesek.com');
        console.log('Şifre: admin123');
    }
}

createTestUser();
