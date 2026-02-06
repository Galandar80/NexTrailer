
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, Calendar } from "lucide-react";
import { tmdbApi, MediaItem, Genre, Article } from "@/services/tmdbApi";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import GenresSection from "@/components/GenresSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import { it } from "date-fns/locale";

const TvSeries = () => {
  const [popularTvShows, setPopularTvShows] = useState<MediaItem[]>([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState<MediaItem[]>([]);
  const [airingToday, setAiringToday] = useState<MediaItem[]>([]);
  const [tvArticles, setTvArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        const [popular, topRated, airing, articles] = await Promise.all([
          tmdbApi.getPopular("tv"),
          tmdbApi.getTopRated("tv"),
          tmdbApi.getAiringToday(),
          tmdbApi.getArticles("tv", 6)
        ]);
        
        setPopularTvShows(popular);
        setTopRatedTvShows(topRated);
        setAiringToday(airing);
        setTvArticles(articles);
      } catch (error) {
        console.error("Errore nel caricamento delle serie TV:", error);
        setLoadingError("Si è verificato un errore nel caricamento dei contenuti.");
        toast({
          title: "Errore nel caricamento dei contenuti",
          description: "Riprova più tardi",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [toast]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data sconosciuta";
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { locale: it, addSuffix: true });
    } catch (e) {
      return "Data sconosciuta";
    }
  };
  
  const renderSkeletonLoader = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="w-[180px] h-[270px] rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
        <h1 className="text-3xl font-poster mb-8">Serie TV</h1>
        
        {isLoading ? (
          renderSkeletonLoader()
        ) : (
          <>
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Newspaper className="text-accent" />
                <h2 className="text-2xl font-medium">Novità dal mondo delle Serie</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tvArticles.map(article => (
                  <Card 
                    key={article.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/${article.media_type}/${article.id}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={tmdbApi.getImageUrl(article.poster_path)} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-2">{article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.overview || "Nessuna descrizione disponibile."}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(article.first_air_date)}
                        </span>
                        <button className="text-accent text-sm hover:underline">
                          Scopri di più
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <GenresSection />
            
            {airingToday.length > 0 && (
              <ContentRow
                title="In Onda Oggi"
                icon={<Calendar className="text-green-500" />}
                items={airingToday}
                showBadges={true}
              />
            )}
            
            {popularTvShows.length > 0 && (
              <ContentRow
                title="Serie TV Popolari"
                items={popularTvShows}
              />
            )}
            
            {topRatedTvShows.length > 0 && (
              <ContentRow
                title="Serie TV Più Votate"
                items={topRatedTvShows}
              />
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TvSeries;
