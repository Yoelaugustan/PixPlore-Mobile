import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { borderColors, FlashCardItem } from '@/types';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<FlashCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error('Error getting user:', err);
        setError('Failed to get current user');
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) {
        setFlashcards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('flashcard')
          .select('*')
          .eq('user_id', user.id)
          .order('id', { ascending: true });

        if (error) throw error;

        const processedData = (data || []).map((item, index) => {
          const frameId = (index % 16) + 1;
          return {
            ...item,
            frameId,
            backgroundColor: borderColors[frameId - 1],
          };
        });

        setFlashcards(processedData);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  return {
    flashcards,
    loading,
    error,
  };
};