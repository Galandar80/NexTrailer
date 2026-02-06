
import { API_URL, fetchWithRetry, fetchWithAccessToken } from './config';
import { Movie, TV, MediaItem } from './types';
import { mockMovies, mockTvShows } from './mockData';

export const search = async (query: string, page: number = 1): Promise<{movies: Movie[], tvShows: TV[]}> => {
  try {
    console.log(`Searching for: "${query}" on page ${page}`);
    const url = `${API_URL}/search/multi?language=it-IT&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetchWithRetry(url);
    const data = await response.json();

    console.log(`Search results: ${data.results?.length || 0} items found`);
    
    // Filter out persons and process the remaining media items
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
      }
    });
    
    return { movies, tvShows };
  } catch (error) {
    console.error("Failed to search content", error);
    
    // Prova con l'access token
    try {
      console.log("Trying search with access token");
      const tokenEndpoint = `/search/multi?language=it-IT&query=${encodeURIComponent(query)}&page=${page}`;
      const tokenResponse = await fetchWithAccessToken(tokenEndpoint);
      const tokenData = await tokenResponse.json();
      
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
        }
      });
      
      if (movies.length > 0 || tvShows.length > 0) {
        return { movies, tvShows };
      }
    } catch (tokenError) {
      console.error("Access token search also failed:", tokenError);
    }
    
    return { 
      movies: mockMovies as Movie[], 
      tvShows: mockTvShows as TV[]
    };
  }
};
