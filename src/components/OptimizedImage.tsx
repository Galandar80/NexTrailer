import { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
}

/**
 * Componente immagine ottimizzato con lazy loading e placeholder
 */
export const OptimizedImage = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <div
                className={`bg-secondary/20 flex items-center justify-center ${className}`}
                {...props}
            >
                <span className="text-muted-foreground text-sm">Immagine non disponibile</span>
            </div>
        );
    }

    return (
        <div className="relative">
            {!isLoaded && (
                <div
                    className={`absolute inset-0 bg-secondary/20 animate-pulse ${className}`}
                />
            )}
            <img
                src={src}
                alt={alt}
                loading={loading}
                decoding="async"
                className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};
