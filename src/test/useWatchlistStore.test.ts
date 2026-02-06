import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWatchlistStore } from '../store/useWatchlistStore';

describe('useWatchlistStore', () => {
    it('should add item to watchlist', () => {
        const { result } = renderHook(() => useWatchlistStore());

        const testItem = {
            id: 1,
            title: 'Test Movie',
            media_type: 'movie' as const,
            poster_path: '/test.jpg',
            vote_average: 8.5,
            release_date: '2024-01-01'
        };

        act(() => {
            result.current.addItem(testItem);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].title).toBe('Test Movie');
    });

    it('should remove item from watchlist', () => {
        const { result } = renderHook(() => useWatchlistStore());

        const testItem = {
            id: 1,
            title: 'Test Movie',
            media_type: 'movie' as const,
            poster_path: '/test.jpg',
            vote_average: 8.5,
            release_date: '2024-01-01'
        };

        act(() => {
            result.current.addItem(testItem);
            result.current.removeItem(1, 'movie');
        });

        expect(result.current.items).toHaveLength(0);
    });

    it('should check if item is in watchlist', () => {
        const { result } = renderHook(() => useWatchlistStore());

        const testItem = {
            id: 1,
            title: 'Test Movie',
            media_type: 'movie' as const,
            poster_path: '/test.jpg',
            vote_average: 8.5,
            release_date: '2024-01-01'
        };

        act(() => {
            result.current.addItem(testItem);
        });

        expect(result.current.isInWatchlist(1, 'movie')).toBe(true);
        expect(result.current.isInWatchlist(2, 'movie')).toBe(false);
    });
});
