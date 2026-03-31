interface Product {
  id: number;
  name: string;
  description: string;
  presentation: string;
  image: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}