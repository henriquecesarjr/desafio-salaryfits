
export class ResponseAllReviews{
  id: string;
  createdAt: Date;
  rating: number;
  comment: string | null;
  user: {
      id: string;
      name: string;
  };
}