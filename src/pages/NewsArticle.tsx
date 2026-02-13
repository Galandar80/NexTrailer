import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { db, isFirebaseEnabled } from "@/services/firebase";

type NewsArticle = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  imageUrl?: string;
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  publishedAtTs: number;
};

const STORAGE_KEY = "news-articles";
const COMINGSOON_STORAGE_KEY = "comingsoon-articles";
const toDocId = (value: string) => encodeURIComponent(value);

const NewsArticlePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isMissing, setIsMissing] = useState(false);

  const candidateIds = useMemo(() => {
    const paramId = searchParams.get("article") || "";
    const raw = paramId || id || "";
    if (!raw) return [];
    const decoded = (() => {
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    })();
    return Array.from(new Set([raw, decoded]));
  }, [id, searchParams]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const shareTitle = article?.title || "News";
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;
  const shareText = `${shareTitle}${shareUrl ? ` - ${shareUrl}` : ""}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);
  const seoImage = article?.imageUrl || "/og-image.png";

  const seoDescription = useMemo(() => {
    if (article?.subtitle) return article.subtitle.trim();
    if (!article?.body) return "News";
    const cleaned = article.body.replace(/\s+/g, " ").trim();
    return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
  }, [article]);

  const publishedIso = useMemo(() => {
    if (!article?.publishedAt) return "";
    const parsed = new Date(article.publishedAt);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString();
  }, [article?.publishedAt]);

  const seoJsonLd = useMemo(() => {
    if (!article) return null;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const logoUrl = origin ? `${origin}/icon-512.png` : "/icon-512.png";
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: seoDescription,
      image: seoImage.startsWith("http") ? seoImage : origin ? `${origin}${seoImage}` : seoImage,
      datePublished: publishedIso || undefined,
      dateModified: publishedIso || undefined,
      author: {
        "@type": "Organization",
        name: "NextTrailer"
      },
      publisher: {
        "@type": "Organization",
        name: "NextTrailer",
        logo: {
          "@type": "ImageObject",
          url: logoUrl
        }
      },
      mainEntityOfPage: shareUrl || undefined
    };
  }, [article, publishedIso, seoDescription, seoImage, shareUrl]);

  const seoType = article ? "article" : "website";

  const handleNativeShare = async () => {
    if (!shareUrl || !canNativeShare) return;
    try {
      await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl });
    } catch {
      return;
    }
  };

  useEffect(() => {
    const loadArticle = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const comingsoonStored = localStorage.getItem(COMINGSOON_STORAGE_KEY);
      const localArticles = stored ? (JSON.parse(stored) as NewsArticle[]) : [];
      const comingsoonArticles = comingsoonStored ? (JSON.parse(comingsoonStored) as NewsArticle[]) : [];
      const normalizedLocal = [...localArticles, ...comingsoonArticles].map((item) => {
        if (item.id) return item;
        const derivedId = item.sourceUrl ? toDocId(item.sourceUrl) : "";
        return { ...item, id: derivedId };
      }).filter((item) => item.id);
      const localMatch = normalizedLocal.find((item) => candidateIds.includes(item.id));
      if (!isFirebaseEnabled || !db) {
        if (localMatch) {
          setArticle(localMatch);
          setIsMissing(false);
        } else {
          setIsMissing(true);
        }
        return;
      }
      try {
        for (const candidateId of candidateIds) {
          const docRef = doc(db, "news_articles", candidateId);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setArticle(snapshot.data() as NewsArticle);
            setIsMissing(false);
            return;
          }
        }
        for (const candidateId of candidateIds) {
          const docRef = doc(db, "news_comingsoon", candidateId);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setArticle(snapshot.data() as NewsArticle);
            setIsMissing(false);
            return;
          }
        }
        if (localMatch) {
          setArticle(localMatch);
          setIsMissing(false);
        } else {
          setIsMissing(true);
        }
      } catch {
        if (localMatch) {
          setArticle(localMatch);
          setIsMissing(false);
        } else {
          setIsMissing(true);
        }
      }
    };
    loadArticle();
  }, [candidateIds]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={article?.title || "News"}
        description={seoDescription}
        image={seoImage}
        type={seoType}
        url={shareUrl}
        publishedTime={article ? publishedIso || undefined : undefined}
        modifiedTime={article ? publishedIso || undefined : undefined}
        author={article ? "NextTrailer" : undefined}
        section={article ? "News" : undefined}
        jsonLd={seoJsonLd || undefined}
      />
      <Navbar />

      <main className="max-w-screen-lg mx-auto px-4 md:px-8 py-8 space-y-6">
        <Button asChild variant="outline" className="w-fit">
          <Link to="/news">Torna alle news</Link>
        </Button>

        {isMissing && (
          <div className="text-muted-foreground">Articolo non disponibile.</div>
        )}

        {article && (
          <article className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
              {article.subtitle && (
                <p className="text-muted-foreground">{article.subtitle}</p>
              )}
              {article.publishedAt && (
                <p className="text-xs text-muted-foreground">
                  {new Date(article.publishedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              )}
            </div>

            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[420px] object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-[260px] rounded-2xl bg-secondary/40" />
            )}

            {article.bullets.length > 0 && (
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {article.bullets.map((bullet, index) => (
                  <li key={`${article.id}-bullet-${index}`}>{bullet}</li>
                ))}
              </ul>
            )}

            <p className="text-base leading-relaxed text-foreground/90">{article.body}</p>

            <div className="pt-4 border-t border-muted/30 flex flex-wrap gap-3 items-center">
              <span className="text-sm text-muted-foreground">Condividi:</span>
              <Button variant="outline" onClick={handleNativeShare} disabled={!shareUrl || !canNativeShare}>
                Condividi
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  X
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://wa.me/?text=${encodedText}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </Button>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsArticlePage;
