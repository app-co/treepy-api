export interface IHistory {
  id?: string;
  title: string;
  subtitle: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  fk_user_id: string;
}
