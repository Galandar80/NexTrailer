
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
    url?: string;
}

export const SEO = ({
    title = "NextTrailer - Scopri Film e Serie TV",
    description = "Esplora i film e le serie TV di tendenza, guarda i trailer e crea la tua watchlist personalizzata.",
    image = "/og-image.png", // Ensure this default image exists or use a remote URL
    type = "website",
    url = window.location.href
}: SEOProps) => {
    const siteTitle = "NextTrailer";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Ensure absolute URL for image
    const fullImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
        </Helmet>
    );
};
