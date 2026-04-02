export interface Resenha {
  id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  time: string
  location: string
  cover_image_url: string | null
  share_code: string
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  title: string
  description: string | null
  share_code: string
  created_at: string
}

export interface CollectionResenha {
  id: string
  collection_id: string
  resenha_id: string
}

export interface Response {
  id: string
  resenha_id: string
  name: string
  status: "confirmed" | "declined"
  comment: string | null
  created_at: string
}

export interface ResenhaWithResponses extends Resenha {
  responses: Response[]
}

export interface CollectionWithResenhas extends Collection {
  resenhas: (Resenha & { responses: Response[] })[]
}
