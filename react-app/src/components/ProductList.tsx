import React, { useEffect, useState } from "react";

const ProductList = ({ category }: { category: string }) => {
  // inline interface category: string
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching products in ", category);
    setProducts(["Clothing", "Household"]);
  }, [category]); // everytime the value of the category changes React should reexecute the effect hook

  return <div>ProductList</div>;
};

export default ProductList;
