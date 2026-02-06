import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";

describe('Navbar', () => {
    it('renders NextTrailer logo', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Trailer')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Film')).toBeInTheDocument();
        expect(screen.getByText('Serie TV')).toBeInTheDocument();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <MemoryRouter>{children}</MemoryRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );

    it('renders watchlist button', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText('Watchlist')).toBeInTheDocument();
    });
});
