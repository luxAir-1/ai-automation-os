/**
 * PropScout AI — Database Types
 *
 * TypeScript types mirroring the Supabase database schema.
 * These were hand-crafted to match supabase/migrations/00001_initial_schema.sql.
 *
 * In production, regenerate with:
 *   npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ------------------------------------------------------------------
      // profiles
      // ------------------------------------------------------------------
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          language: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // subscriptions
      // ------------------------------------------------------------------
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: 'free' | 'starter' | 'pro' | 'founding_member';
          status: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'free' | 'starter' | 'pro' | 'founding_member';
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'free' | 'starter' | 'pro' | 'founding_member';
          status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // properties
      // ------------------------------------------------------------------
      properties: {
        Row: {
          id: string;
          external_id: string;
          source: 'pararius' | 'funda' | 'manual';
          url: string;
          title: string;
          description: string | null;
          price: number;
          price_per_sqm: number | null;
          square_meters: number | null;
          rooms: number | null;
          bedrooms: number | null;
          property_type: 'apartment' | 'house' | 'studio' | 'room' | 'other' | null;
          city: string;
          neighborhood: string | null;
          postal_code: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          year_built: number | null;
          energy_label: string | null;
          interior: 'furnished' | 'unfurnished' | 'shell' | 'upholstered' | null;
          available_from: string | null;
          listing_status: 'active' | 'rented' | 'withdrawn';
          images: Json;
          raw_data: Json | null;
          first_seen_at: string;
          last_seen_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          external_id: string;
          source?: 'pararius' | 'funda' | 'manual';
          url: string;
          title: string;
          description?: string | null;
          price: number;
          price_per_sqm?: number | null;
          square_meters?: number | null;
          rooms?: number | null;
          bedrooms?: number | null;
          property_type?: 'apartment' | 'house' | 'studio' | 'room' | 'other' | null;
          city: string;
          neighborhood?: string | null;
          postal_code?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          year_built?: number | null;
          energy_label?: string | null;
          interior?: 'furnished' | 'unfurnished' | 'shell' | 'upholstered' | null;
          available_from?: string | null;
          listing_status?: 'active' | 'rented' | 'withdrawn';
          images?: Json;
          raw_data?: Json | null;
          first_seen_at?: string;
          last_seen_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          external_id?: string;
          source?: 'pararius' | 'funda' | 'manual';
          url?: string;
          title?: string;
          description?: string | null;
          price?: number;
          price_per_sqm?: number | null;
          square_meters?: number | null;
          rooms?: number | null;
          bedrooms?: number | null;
          property_type?: 'apartment' | 'house' | 'studio' | 'room' | 'other' | null;
          city?: string;
          neighborhood?: string | null;
          postal_code?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          year_built?: number | null;
          energy_label?: string | null;
          interior?: 'furnished' | 'unfurnished' | 'shell' | 'upholstered' | null;
          available_from?: string | null;
          listing_status?: 'active' | 'rented' | 'withdrawn';
          images?: Json;
          raw_data?: Json | null;
          first_seen_at?: string;
          last_seen_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // property_analyses
      // ------------------------------------------------------------------
      property_analyses: {
        Row: {
          id: string;
          property_id: string;
          wws_score: number | null;
          wws_max_rent: number | null;
          rent_vs_wws_ratio: number | null;
          investment_score: number | null;
          neighborhood_score: number | null;
          value_score: number | null;
          overall_score: number | null;
          ai_summary: string | null;
          ai_pros: Json;
          ai_cons: Json;
          scoring_version: string;
          analyzed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          wws_score?: number | null;
          wws_max_rent?: number | null;
          rent_vs_wws_ratio?: number | null;
          investment_score?: number | null;
          neighborhood_score?: number | null;
          value_score?: number | null;
          overall_score?: number | null;
          ai_summary?: string | null;
          ai_pros?: Json;
          ai_cons?: Json;
          scoring_version?: string;
          analyzed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          wws_score?: number | null;
          wws_max_rent?: number | null;
          rent_vs_wws_ratio?: number | null;
          investment_score?: number | null;
          neighborhood_score?: number | null;
          value_score?: number | null;
          overall_score?: number | null;
          ai_summary?: string | null;
          ai_pros?: Json;
          ai_cons?: Json;
          scoring_version?: string;
          analyzed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // investment_criteria
      // ------------------------------------------------------------------
      investment_criteria: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          cities: Json;
          min_price: number | null;
          max_price: number | null;
          min_rooms: number | null;
          max_rooms: number | null;
          min_sqm: number | null;
          max_sqm: number | null;
          property_types: Json;
          min_score: number | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          cities?: Json;
          min_price?: number | null;
          max_price?: number | null;
          min_rooms?: number | null;
          max_rooms?: number | null;
          min_sqm?: number | null;
          max_sqm?: number | null;
          property_types?: Json;
          min_score?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          cities?: Json;
          min_price?: number | null;
          max_price?: number | null;
          min_rooms?: number | null;
          max_rooms?: number | null;
          min_sqm?: number | null;
          max_sqm?: number | null;
          property_types?: Json;
          min_score?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // alerts
      // ------------------------------------------------------------------
      alerts: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          criteria_id: string | null;
          alert_type: 'new_match' | 'price_change' | 'score_update';
          channel: 'email' | 'in_app' | 'both';
          status: 'pending' | 'sent' | 'read' | 'dismissed';
          sent_at: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          criteria_id?: string | null;
          alert_type?: 'new_match' | 'price_change' | 'score_update';
          channel?: 'email' | 'in_app' | 'both';
          status?: 'pending' | 'sent' | 'read' | 'dismissed';
          sent_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          criteria_id?: string | null;
          alert_type?: 'new_match' | 'price_change' | 'score_update';
          channel?: 'email' | 'in_app' | 'both';
          status?: 'pending' | 'sent' | 'read' | 'dismissed';
          sent_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // alert_quotas
      // ------------------------------------------------------------------
      alert_quotas: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          alerts_sent: number | null;
          max_alerts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          alerts_sent?: number | null;
          max_alerts?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_start?: string;
          period_end?: string;
          alerts_sent?: number | null;
          max_alerts?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // saved_properties
      // ------------------------------------------------------------------
      saved_properties: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ------------------------------------------------------------------
      // reports
      // ------------------------------------------------------------------
      reports: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          report_type: 'full' | 'summary' | 'comparison';
          content: Json | null;
          pdf_url: string | null;
          status: 'generating' | 'ready' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          report_type?: 'full' | 'summary' | 'comparison';
          content?: Json | null;
          pdf_url?: string | null;
          status?: 'generating' | 'ready' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          report_type?: 'full' | 'summary' | 'comparison';
          content?: Json | null;
          pdf_url?: string | null;
          status?: 'generating' | 'ready' | 'failed';
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// =============================================================================
// Convenience row type aliases
// =============================================================================

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyAnalysis = Database['public']['Tables']['property_analyses']['Row'];
export type InvestmentCriteria = Database['public']['Tables']['investment_criteria']['Row'];
export type Alert = Database['public']['Tables']['alerts']['Row'];
export type AlertQuota = Database['public']['Tables']['alert_quotas']['Row'];
export type SavedProperty = Database['public']['Tables']['saved_properties']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];

// Convenience insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyAnalysisInsert = Database['public']['Tables']['property_analyses']['Insert'];
export type InvestmentCriteriaInsert = Database['public']['Tables']['investment_criteria']['Insert'];
export type AlertInsert = Database['public']['Tables']['alerts']['Insert'];
export type AlertQuotaInsert = Database['public']['Tables']['alert_quotas']['Insert'];
export type SavedPropertyInsert = Database['public']['Tables']['saved_properties']['Insert'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];

// Convenience update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
export type PropertyAnalysisUpdate = Database['public']['Tables']['property_analyses']['Update'];
export type InvestmentCriteriaUpdate = Database['public']['Tables']['investment_criteria']['Update'];
export type AlertUpdate = Database['public']['Tables']['alerts']['Update'];
export type AlertQuotaUpdate = Database['public']['Tables']['alert_quotas']['Update'];
export type SavedPropertyUpdate = Database['public']['Tables']['saved_properties']['Update'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];

// =============================================================================
// Tables helper type (for Supabase client generics)
// =============================================================================
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
