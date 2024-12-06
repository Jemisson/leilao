import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/categories";

type Category = {
  id: string;
  attributes: {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (err) {
        console.log(err);
        
        setError("Erro ao carregar categorias.");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Categorias</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.attributes.title}</strong>
            <p>ID: {category.attributes.id}</p>
            <p>Descrição: {category.attributes.description || "N/A"}</p>
            <p>Criado em: {new Date(category.attributes.created_at).toLocaleString()}</p>
            <p>Atualizado em: {new Date(category.attributes.updated_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
