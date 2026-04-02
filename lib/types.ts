export interface Guest {
  id: string
  name: string
  email: string
  unique_code: string
  created_at: string
}

export interface Resenha {
  id: string
  title: string
  description: string | null
  date: string
  time: string
  location: string
  cover_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Invite {
  id: string
  guest_id: string
  resenha_id: string
  status: 'pending' | 'sent' | 'viewed' | 'confirmed' | 'declined'
  sent_at: string | null
  viewed_at: string | null
  confirmed_at: string | null
  created_at: string
}

export interface InviteWithDetails extends Invite {
  guest: Guest
  resenha: Resenha
}

export interface ResenhaWithInvites extends Resenha {
  invites: (Invite & { guest: Guest })[]
}
