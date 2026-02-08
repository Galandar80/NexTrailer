
import { API_URL, fetchWithRetry, fetchWithAccessToken } from './config';
import { Movie, TV, MediaItem } from './types';
import { mockMovies, mockTvShows } from './mockData';

type SearchOptions = {
  includePeople?: boolean;
};

export const search = async (
  query: string,
  page: number = 1,
  options: SearchOptions = {}
): Promise<{ movies: Movie[]; tvShows: TV[]; people: MediaItem[] }> => {
  try {
    console.log(`Searching for: "${query}" on page ${page}`);
    const url = `${API_URL}/search/multi?language=it-IT&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetchWithRetry(url);
    const data = await response.json();

    console.log(`Search results: ${data.results?.length || 0} items found`);
    
    const people: MediaItem[] = [];
    const movies: Movie[] = [];
    const tvShows: TV[] = [];
    
    if (!data.results || data.results.length === 0) {
      throw new Error("No search results found");
    }
    
    data.results.forEach((item: MediaItem) => {
      if (item.media_type === "movie") {
        movies.push({
          ...item,
          media_type: "movie" as const
        } as Movie);
      } else if (item.media_type === "tv") {
        tvShows.push({
          ...item,
          media_type: "tv" as const
        } as TV);
      } else if (item.media_type === "person" && options.includePeople) {
        people.push({
          ...item,
          media_type: "person" as const
        });
      }
    });
    
    return { movies, tvShows, people };
  } catch (error) {
    console.error("Failed to search content", error);
    
    // Prova con l'access token
    try {
      console.log("Trying search with access token");
      const tokenEndpoint = `/search/multi?language=it-IT&query=${encodeURIComponent(query)}&page=${page}`;
      const tokenResponse = await fetchWithAccessToken(tokenEndpoint);
      const tokenData = await tokenResponse.json();
      
      const people: MediaItem[] = [];
      const movies: Movie[] = [];
      const tvShows: TV[] = [];
      
      tokenData.results?.forEach((item: MediaItem) => {
        if (item.media_type === "movie") {
          movies.push({
            ...item,
            media_type: "movie" as const
          } as Movie);
        } else if (item.media_type === "tv") {
          tvShows.push({
            ...item,
            media_type: "tv" as const
          } as TV);
        } else if (item.media_type === "person" && options.includePeople) {
          people.push({
            ...item,
            media_type: "person" as const
          });
        }
      });
      
      if (movies.length > 0 || tvShows.length > 0 || people.length > 0) {
        return { movies, tvShows, people };
      }
    } catch (tokenError) {
      console.error("Access token search also failed:", tokenError);
    }
    
    return { 
      movies: mockMovies as Movie[], 
      tvShows: mockTvShows as TV[],
      people: []
    };
  }
};
