export interface CreateBookDTO {
  titulo: string;
  ano: number;
  autor: string;
  descricao: string;
}

export interface UpdateBookDTO {
  titulo?: string;
  ano?: number;
  autor?: string;
  descricao?: string;
}

export interface BookResponse {
  id: number;
  titulo: string;
  ano: number;
  autor: string;
  descricao: string;
  createdAt: Date;
  updatedAt: Date;
}
