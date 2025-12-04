export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  images?: string[]
}

// Products for UTOPIE 3D fabrication services
export const PRODUCTS: Product[] = [
  {
    id: "fabrication-base",
    name: "Service de Fabrication 3D",
    description: "Fabrication et impression 3D professionnelle avec matériaux durables",
    priceInCents: 4900, // €49.00
  },
]
