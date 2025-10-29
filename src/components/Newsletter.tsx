import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Geçerli bir e-posta adresi girin');

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: 'Hata',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Bilgi',
            description: 'Bu e-posta adresi zaten kayıtlı',
            variant: 'default',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Başarılı!',
          description: 'Haftalık bültene kaydoldunuz',
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Haftalık Bülten</CardTitle>
        </div>
        <CardDescription>
          En yeni tarifler, ipuçları ve haberler için abone olun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Abone Ol'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
