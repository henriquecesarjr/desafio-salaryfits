
export class ResponseBookDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  author: string;
  description?: string | null;
  year: number;
}