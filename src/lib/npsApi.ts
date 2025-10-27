// NPS API Integration
const API_KEY = process.env.NPS_API_KEY || "";
const BASE_URL = "https://developer.nps.gov/api/v1";

export interface ImageCrop {
  aspectRatio: number;
  url: string;
}

export interface WebcamImage {
  url: string;
  credit: string;
  altText: string;
  caption: string;
  title: string;
  description: string;
  crops?: ImageCrop[];
}

export interface RelatedPark {
  states: string;
  parkCode: string;
  designation: string;
  fullName: string;
  url: string;
  name: string;
}

export interface Webcam {
  id: string;
  url: string;
  title: string;
  description: string;
  images: WebcamImage[];
  relatedParks: RelatedPark[];
  status: string;
  statusMessage: string;
  isStreaming: boolean;
  tags: string[];
  latitude: number;
  longitude: number;
  geometryPoiId: string;
  credit: string;
}

export interface WebcamResponse {
  total: string;
  limit: string;
  start: string;
  data: Webcam[];
}

/**
 * Fetch a random webcam from the NPS API
 * Only returns webcams that have images
 * Uses a more efficient approach: fetches batches and filters for webcams with images
 * @param excludeIds - Array of webcam IDs to exclude from results
 */
export async function getRandomWebcam(excludeIds: string[] = []): Promise<Webcam | null> {
  try {
    // First, get total count of webcams
    const initialUrl = `${BASE_URL}/webcams?limit=1&api_key=${API_KEY}`;
    const initialResponse = await fetch(initialUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!initialResponse.ok) {
      throw new Error("Failed to fetch webcam count");
    }

    const initialData: WebcamResponse = await initialResponse.json();
    const total = parseInt(initialData.total, 10);

    // Try up to 10 batches to find webcams with images
    for (let attempt = 0; attempt < 10; attempt++) {
      // Get a random offset within the total range
      const randomOffset = Math.floor(Math.random() * Math.max(0, total - 10));

      // Fetch a batch of 10 webcams at once for better variety
      const url = `${BASE_URL}/webcams?limit=10&start=${randomOffset}&api_key=${API_KEY}`;
      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        continue; // Try next batch
      }

      const data: WebcamResponse = await response.json();

      if (data.data && data.data.length > 0) {
        // Filter for webcams with images and exclude seen ones
        const webcamsWithImages = data.data.filter(
          (webcam) => 
            webcam.images && 
            webcam.images.length > 0 && 
            !excludeIds.includes(webcam.id)
        );

        // If we found any with images, randomly select one
        if (webcamsWithImages.length > 0) {
          const randomIndex = Math.floor(Math.random() * webcamsWithImages.length);
          return webcamsWithImages[randomIndex];
        }
      }
    }

    // If we didn't find a webcam with images after all attempts, return null
    console.warn("Could not find a webcam with images after multiple attempts");
    return null;
  } catch (error) {
    console.error("Error fetching webcam:", error);
    return null;
  }
}

/**
 * Get all webcams (with pagination)
 */
export async function getAllWebcams(start = 0, limit = 10): Promise<Webcam[]> {
  try {
    const url = `${BASE_URL}/webcams?limit=${limit}&start=${start}&api_key=${API_KEY}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch webcams");
    }

    const data: WebcamResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching webcams:", error);
    return [];
  }
}


