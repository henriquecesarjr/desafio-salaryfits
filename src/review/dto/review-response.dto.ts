
export class ResponseReviewDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  comment: string | null;
  bookId: string;
  userId: string;
}