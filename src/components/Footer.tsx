
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-muted/20 py-8 px-4 md:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-poster text-accent">Next</span>
              <span className="text-2xl font-poster text-white">Trailer</span>
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              Il tuo portale di scoperta cinematografica
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Esplora</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/movies" className="hover:text-accent">Film</a></li>
                <li><a href="/tv" className="hover:text-accent">Serie TV</a></li>
                <li><a href="/trending" className="hover:text-accent">Tendenze</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Funzionalità</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/watchlist" className="hover:text-accent">Watchlist</a></li>
                <li><a href="/search" className="hover:text-accent">Ricerca Avanzata</a></li>
                <li><a href="/recommendations" className="hover:text-accent">Consigli</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Info</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/about" className="hover:text-accent">Chi Siamo</a></li>
                <li><a href="/privacy" className="hover:text-accent">Privacy</a></li>
                <li><a href="/terms" className="hover:text-accent">Termini di Utilizzo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contatti</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="https://twitter.com" className="hover:text-accent">Twitter</a></li>
                <li><a href="https://instagram.com" className="hover:text-accent">Instagram</a></li>
                <li>
                  <a href="https://github.com" className="hover:text-accent flex items-center">
                    <Github className="h-4 w-4 mr-1" /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-muted/20 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NextTrailer. Tutti i diritti riservati.</p>
          <p className="mt-2 md:mt-0">
            Dati sui film forniti da <span className="text-muted-foreground/70">fonti di terze parti</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
