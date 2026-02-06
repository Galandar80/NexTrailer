import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Film, Tv } from "lucide-react";

// Generi con icone emoji
const movieGenres = [
    { id: 28, name: "Azione", icon: "⚔️" },
    { id: 12, name: "Avventura", icon: "🗺️" },
    { id: 16, name: "Animazione", icon: "🎨" },
    { id: 35, name: "Commedia", icon: "😂" },
    { id: 80, name: "Crime", icon: "🔫" },
    { id: 99, name: "Documentario", icon: "📚" },
    { id: 18, name: "Dramma", icon: "🎭" },
    { id: 10751, name: "Famiglia", icon: "👨‍👩‍👧‍👦" },
    { id: 14, name: "Fantasy", icon: "✨" },
    { id: 36, name: "Storia", icon: "📜" },
    { id: 27, name: "Horror", icon: "😱" },
    { id: 10402, name: "Musica", icon: "🎵" },
    { id: 9648, name: "Mistero", icon: "🔍" },
    { id: 10749, name: "Romance", icon: "❤️" },
    { id: 878, name: "Fantascienza", icon: "🚀" },
    { id: 10770, name: "televisione film", icon: "📺" },
    { id: 53, name: "Thriller", icon: "😰" },
    { id: 10752, name: "Guerra", icon: "⚔️" },
    { id: 37, name: "Western", icon: "🤠" },
];

const tvGenres = [
    { id: 10759, name: "Azione", icon: "⚔️" },
    { id: 16, name: "Animazione", icon: "🎨" },
    { id: 35, name: "Commedia", icon: "😂" },
    { id: 80, name: "Crime", icon: "🔫" },
    { id: 99, name: "Documentario", icon: "📚" },
    { id: 18, name: "Dramma", icon: "🎭" },
    { id: 10751, name: "Famiglia", icon: "👨‍👩‍👧‍👦" },
    { id: 10762, name: "Kids", icon: "👶" },
    { id: 9648, name: "Mistero", icon: "🔍" },
    { id: 10763, name: "News", icon: "📰" },
    { id: 10764, name: "Reality", icon: "📹" },
    { id: 10765, name: "Sci-Fi & Fantasy", icon: "🚀" },
    { id: 10766, name: "Soap", icon: "🧼" },
    { id: 10767, name: "Talk", icon: "💬" },
    { id: 10768, name: "War & Politics", icon: "⚖️" },
    { id: 37, name: "Western", icon: "🤠" },
];

const Genres = () => {
    const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");
    const navigate = useNavigate();

    const genres = activeTab === "movie" ? movieGenres : tvGenres;

    const handleGenreClick = (genreId: number, genreName: string) => {
        navigate(`/${activeTab}/genre/${genreId}?name=${encodeURIComponent(genreName)}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Sfoglia per Genere</h1>
                    <p className="text-muted-foreground">
                        Esplora film e serie TV per genere
                    </p>
                </div>

                {/* Tab Film/Serie TV */}
                <div className="flex gap-2 mb-8">
                    <Button
                        variant={activeTab === "movie" ? "default" : "outline"}
                        onClick={() => setActiveTab("movie")}
                        className="flex items-center gap-2"
                    >
                        <Film className="h-4 w-4" />
                        Film
                    </Button>
                    <Button
                        variant={activeTab === "tv" ? "default" : "outline"}
                        onClick={() => setActiveTab("tv")}
                        className="flex items-center gap-2"
                    >
                        <Tv className="h-4 w-4" />
                        Serie TV
                    </Button>
                </div>

                {/* Griglia Generi */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => handleGenreClick(genre.id, genre.name)}
                            className="group relative aspect-square bg-secondary/20 hover:bg-secondary/40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-muted/30 hover:border-accent/50"
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                    {genre.icon}
                                </span>
                                <span className="text-sm font-medium text-center group-hover:text-accent transition-colors">
                                    {genre.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Genres;
