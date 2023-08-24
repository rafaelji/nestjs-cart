export interface Cart {
  cartItems: CartItem[];
  total: number;
}
export interface CartItem {
  id: number;
  title: string;
  price: string;
  option1: string;
  option2: string;
}
