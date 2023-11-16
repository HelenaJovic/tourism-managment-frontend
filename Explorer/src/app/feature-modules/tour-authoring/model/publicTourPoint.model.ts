export interface PublicTourPoint {
    id?: number;
    tourId: number;
    name: string;
    description: string;
    imageUrl: string;
    latitude?: number;
    longitude?: number;
  }