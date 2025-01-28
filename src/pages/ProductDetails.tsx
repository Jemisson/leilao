import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";
import { Product } from "../types";
import BidTable from "../components/BidTable";

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productData = await fetchProductById(Number(productId));
        setProduct(productData.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto:", err);
        setError("Erro ao carregar os detalhes do produto. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 flex flex-wrap justify-between">
      <div className="flex justify-between w-full min-h-1">
        <h1 className="font-bold text-5xl">Lote</h1>
        <a
          onClick={() => navigate(`/dashboard/produtos/${product?.id}/edit`)}
          className="font-bold flex justify-center items-center text-yellow-500 hover:text-yellow-700 border border-yellow-700 rounded py-2 px-4"
          aria-label="Editar"
        >
          Editar produto
        </a>
      </div>

      <div className="w-1/3">
        {product && (
          <div className="mb-6">
            <h1 className="text-7xl font-bold mb-2 text-redBright">{product.attributes.lot_number}</h1>
            <p className="text-gray-700">
              <strong>Descrição:</strong> {product.attributes.description}
            </p>
            <p className="text-gray-700">
              <strong>Valor Inicial:</strong> R$ {product.attributes.minimum_value}
            </p>
            <p className="text-gray-700">
              <strong>Valor atual:</strong> R$ {product.attributes.current_value}
            </p>
            <div className="flex gap-10 justify-start flex-wrap mt-10">
              {product.attributes.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={`Imagem ${image.id}`}
                  className="w-1/6 h-1/6 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-2/3 pl-10">
        <h2 className="text-xl font-bold mb-4">Histórico de Lances</h2>
        <BidTable showLotNumber={false} productId={Number(productId)} />
      </div>
    </div>
  );
};

export default ProductDetails;
