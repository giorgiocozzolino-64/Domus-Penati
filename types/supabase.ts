/**
 * DOMUS PENATI – Tipi del database Supabase
 *
 * Schema minimo per l'MVP.
 * Aggiornare con `supabase gen types typescript --project-id <id> > types/supabase.ts`
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type MemoryType = 'video' | 'audio' | 'photo' | 'document' | 'text'
export type MemberRole = 'owner' | 'parent' | 'child' | 'grandparent' | 'sibling' | 'spouse' | 'family'
export type InviteStatus = 'pending' | 'accepted' | 'expired'

export interface Database {
  public: {
    Tables: {
      // ── Famiglie ─────────────────────────────────────────
      families: {
        Row: {
          id:          string
          name:        string
          owner_id:    string
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id?:         string
          name:        string
          owner_id:    string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?:       string
          updated_at?: string
        }
      }

      // ── Membri della famiglia ─────────────────────────────
      family_members: {
        Row: {
          id:          string
          family_id:   string
          user_id:     string
          role:        MemberRole
          display_name:string | null
          joined_at:   string
        }
        Insert: {
          id?:          string
          family_id:    string
          user_id:      string
          role?:        MemberRole
          display_name?: string | null
          joined_at?:   string
        }
        Update: {
          role?:         MemberRole
          display_name?: string | null
        }
      }

      // ── Ricordi ──────────────────────────────────────────
      memories: {
        Row: {
          id:           string
          family_id:    string
          title:        string
          type:         MemoryType
          storage_path: string | null
          description:  string | null
          year:         number | null
          location:     string | null
          created_by:   string
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          family_id:     string
          title:         string
          type:          MemoryType
          storage_path?: string | null
          description?:  string | null
          year?:         number | null
          location?:     string | null
          created_by:    string
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          title?:        string
          description?:  string | null
          year?:         number | null
          location?:     string | null
          updated_at?:   string
        }
      }

      // ── Inviti ───────────────────────────────────────────
      invitations: {
        Row: {
          id:          string
          family_id:   string
          email:       string
          role:        MemberRole
          invited_by:  string
          status:      InviteStatus
          expires_at:  string
          accepted_at: string | null
          created_at:  string
        }
        Insert: {
          id?:          string
          family_id:    string
          email:        string
          role?:        MemberRole
          invited_by:   string
          status?:      InviteStatus
          expires_at?:  string
          accepted_at?: string | null
          created_at?:  string
        }
        Update: {
          status?:      InviteStatus
          accepted_at?: string | null
        }
      }
    }

    Views:   { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums:   { [_ in never]: never }
  }
}

// ── Tipi di utilità ───────────────────────────────────────────
export type Family       = Database['public']['Tables']['families']['Row']
export type Memory       = Database['public']['Tables']['memories']['Row']
export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type Invitation   = Database['public']['Tables']['invitations']['Row']
