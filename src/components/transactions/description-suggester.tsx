'use client';
import { suggestTransactionDescription } from '@/ai/flows/transaction-description-suggestions';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';

interface DescriptionSuggesterProps {
  currentDescription: string;
  pastTransactions: string[];
  onSuggestionSelect: (suggestion: string) => void;
}

export function DescriptionSuggester({
  currentDescription,
  pastTransactions,
  onSuggestionSelect,
}: DescriptionSuggesterProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedDescription = useDebounce(currentDescription, 500);

  const fetchSuggestions = useCallback(async () => {
    if (!debouncedDescription || debouncedDescription.length < 3 || pastTransactions.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await suggestTransactionDescription({
        currentDescription: debouncedDescription,
        pastTransactions: [...new Set(pastTransactions)], // Pass unique descriptions
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedDescription, pastTransactions]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Getting AI suggestions...</span>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => onSuggestionSelect(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
}
