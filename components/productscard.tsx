type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductsCard({ id, name, description, price, image }: ProductCardProps) {
  return (
    <div className="product-card" key={id}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
      <span>€ {price.toFixed(2)}</span>
      <button>Vedi dettagli</button>
    </div>
  );
}
