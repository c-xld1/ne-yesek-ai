import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Question {
    id: string;
    title: string;
    content: string;
    category: string;
    author_id: string;
    author_name: string;
    author_avatar?: string;
    author_reputation: number;
    views: number;
    likes: number;
    dislikes: number;
    is_solved: boolean;
    created_at: string;
    updated_at: string;
    answers?: Answer[];
    answer_count?: number;
    best_answer?: Answer;
}

export interface Answer {
    id: string;
    question_id: string;
    content: string;
    author_id: string;
    author_name: string;
    author_avatar?: string;
    likes: number;
    dislikes: number;
    is_best_answer: boolean;
    created_at: string;
    updated_at: string;
}

export interface QuestionFilters {
    category?: string;
    sortBy?: 'newest' | 'popular' | 'unanswered' | 'solved';
    search?: string;
}

// Questions'ları getir
export const useQuestions = (filters: QuestionFilters = {}) => {
    return useQuery({
        queryKey: ['questions', filters],
        queryFn: async () => {
            let query = supabase
                .from('questions')
                .select(`
          *,
          answers(count)
        `);

            // Kategori filtresi
            if (filters.category && filters.category !== 'Tümü') {
                query = query.eq('category', filters.category);
            }

            // Arama filtresi
            if (filters.search) {
                query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
            }

            // Sıralama
            switch (filters.sortBy) {
                case 'popular':
                    query = query.order('likes', { ascending: false });
                    break;
                case 'unanswered':
                    query = query.eq('is_solved', false);
                    break;
                case 'solved':
                    query = query.eq('is_solved', true);
                    break;
                default: // newest
                    query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;

            // Her soru için en iyi cevabı ayrı olarak getir
            const questionsWithBestAnswers = await Promise.all(
                (data || []).map(async (question) => {
                    // En iyi cevabı getir
                    const { data: bestAnswer } = await supabase
                        .from('answers')
                        .select('*')
                        .eq('question_id', question.id)
                        .eq('is_best_answer', true)
                        .single();

                    return {
                        ...question,
                        answer_count: question.answers?.[0]?.count || 0,
                        best_answer: bestAnswer || null
                    };
                })
            );

            return questionsWithBestAnswers;
        },
    });
};

// Tek question getir
export const useQuestion = (id: string) => {
    return useQuery({
        queryKey: ['question', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('questions')
                .select(`
          *,
          answers(*)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id,
    });
};

// Question oluştur
export const useCreateQuestion = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (questionData: {
            title: string;
            content: string;
            category: string;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Giriş yapmanız gerekiyor');

            // User profile'ından bilgileri al
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single();

            const { data, error } = await supabase
                .from('questions')
                .insert({
                    title: questionData.title,
                    content: questionData.content,
                    category: questionData.category,
                    author_id: user.id,
                    author_name: profile?.full_name || user.email?.split('@')[0] || 'Anonim',
                    author_avatar: profile?.avatar_url,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            toast({
                title: "Başarılı!",
                description: "Sorunuz başarıyla oluşturuldu.",
            });
        },
        onError: (error) => {
            toast({
                title: "Hata!",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

// Answer oluştur
export const useCreateAnswer = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (answerData: {
            question_id: string;
            content: string;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Giriş yapmanız gerekiyor');

            // User profile'ından bilgileri al
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single();

            const { data, error } = await supabase
                .from('answers')
                .insert({
                    question_id: answerData.question_id,
                    content: answerData.content,
                    author_id: user.id,
                    author_name: profile?.full_name || user.email?.split('@')[0] || 'Anonim',
                    author_avatar: profile?.avatar_url,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            queryClient.invalidateQueries({ queryKey: ['question', variables.question_id] });
            toast({
                title: "Başarılı!",
                description: "Cevabınız başarıyla eklendi.",
            });
        },
        onError: (error) => {
            toast({
                title: "Hata!",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

// Question like/dislike
export const useToggleQuestionLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { question_id: string; is_like: boolean }) => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Giriş yapmanız gerekiyor');

            // Mevcut like'ı kontrol et
            const { data: existingLike } = await supabase
                .from('question_likes')
                .select('*')
                .eq('question_id', data.question_id)
                .eq('user_id', user.id)
                .single();

            if (existingLike) {
                if (existingLike.is_like === data.is_like) {
                    // Aynı aksiyonu tekrar yapmışsa, like'ı sil
                    const { error } = await supabase
                        .from('question_likes')
                        .delete()
                        .eq('question_id', data.question_id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                } else {
                    // Farklı aksiyon yapmışsa, güncelle
                    const { error } = await supabase
                        .from('question_likes')
                        .update({ is_like: data.is_like })
                        .eq('question_id', data.question_id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                }
            } else {
                // Yeni like ekle
                const { error } = await supabase
                    .from('question_likes')
                    .insert({
                        question_id: data.question_id,
                        user_id: user.id,
                        is_like: data.is_like,
                    });

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

// Answer like/dislike
export const useToggleAnswerLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { answer_id: string; is_like: boolean }) => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Giriş yapmanız gerekiyor');

            // Mevcut like'ı kontrol et
            const { data: existingLike } = await supabase
                .from('answer_likes')
                .select('*')
                .eq('answer_id', data.answer_id)
                .eq('user_id', user.id)
                .single();

            if (existingLike) {
                if (existingLike.is_like === data.is_like) {
                    // Aynı aksiyonu tekrar yapmışsa, like'ı sil
                    const { error } = await supabase
                        .from('answer_likes')
                        .delete()
                        .eq('answer_id', data.answer_id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                } else {
                    // Farklı aksiyon yapmışsa, güncelle
                    const { error } = await supabase
                        .from('answer_likes')
                        .update({ is_like: data.is_like })
                        .eq('answer_id', data.answer_id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                }
            } else {
                // Yeni like ekle
                const { error } = await supabase
                    .from('answer_likes')
                    .insert({
                        answer_id: data.answer_id,
                        user_id: user.id,
                        is_like: data.is_like,
                    });

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

// Question view ekle
export const useAddQuestionView = () => {
    return useMutation({
        mutationFn: async (question_id: string) => {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('question_views')
                .insert({
                    question_id,
                    user_id: user?.id || null,
                });

            if (error) throw error;
        },
    });
};

// Best answer olarak işaretle
export const useMarkBestAnswer = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: { answer_id: string; question_id: string }) => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Giriş yapmanız gerekiyor');

            // Sorunun sahibi olup olmadığını kontrol et
            const { data: question } = await supabase
                .from('questions')
                .select('author_id')
                .eq('id', data.question_id)
                .single();

            if (question?.author_id !== user.id) {
                throw new Error('Sadece sorunun sahibi en iyi cevabı seçebilir');
            }

            // Önce diğer best answer'ları false yap
            await supabase
                .from('answers')
                .update({ is_best_answer: false })
                .eq('question_id', data.question_id);

            // Seçilen cevabı best answer yap
            const { error } = await supabase
                .from('answers')
                .update({ is_best_answer: true })
                .eq('id', data.answer_id);

            if (error) throw error;

            // Soruyu çözüldü olarak işaretle
            await supabase
                .from('questions')
                .update({ is_solved: true })
                .eq('id', data.question_id);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            queryClient.invalidateQueries({ queryKey: ['question', variables.question_id] });
            toast({
                title: "Başarılı!",
                description: "En iyi cevap olarak işaretlendi.",
            });
        },
        onError: (error) => {
            toast({
                title: "Hata!",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};
