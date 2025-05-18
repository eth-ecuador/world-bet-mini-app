export type Bet = {
  bet_id: string;
  status: "placed";
  selection_id: string;
  event_name: string;
  selection_name: string;
  odds: number;
  stake_amount: number;
  currency: string;
  potential_return: number;
  commission: {
    standard: number;
    ai_premium: number;
    profit_percentage: number;
  };
  created_at: string;
  estimated_result_time: string;
};

export type CreateBetResponse = Bet;
