
export interface CoinJar {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  created_at: string;
  total_amount: number;
  target_amount: number;
  percent_complete: number;
  delivery_status: 'pending' | 'processing' | 'delivered';
  coinjar_contributions: Array<{ amount: number }>;
  creator_id?: string; // Added this field
}

export interface InvitedJar extends CoinJar {
  // InvitedJar extends CoinJar to avoid type errors
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  read: boolean;
}
