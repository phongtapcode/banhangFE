import "./ProductPage.scss";
import React, { useEffect, useState } from "react";
import { Slider, Breadcrumb } from "antd";
import categoryPhone from "../../assets/category";
import CheckboxComponent from "./components/Checkbox/Checkbox";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import Card from "../../components/Card/Card";
import Loading from "../../components/Loading/Loading";

const categoryMemory = ["32", "64", "128", "256", "512"];

const categoryPhoneFilter = {
  title: "Danh mục sản phẩm",
  category: categoryPhone,
  filter: "type",
};

const categoryMemoryFilter = {
  title: "Bộ nhớ",
  category: categoryMemory,
  filter: "memory",
};

function ProductPage() {
  const [priceFilter, setPriceFilter] = useState([1, 100]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [valueSearch, setValueSearch] = useState({
    type: [],
    memory: [],
    price: [1,100],
  });

  const handleOnChangePrice = (value) => {
    setPriceFilter(value);
    setValueSearch({...valueSearch,["price"]: value})
  };

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProductAll,
    config: { retry: 3, retryDelay: 1000 },
  });

  useEffect(() => {
    setProducts(data?.data);
  }, [data]);

  const handleCheckboxChange = (listFilter) => {
    setValueSearch({...valueSearch,[listFilter.filter]: listFilter.listFilter})
  };

   const handleFilterProduct = async () => {
    setLoadingProducts(true);

    let valueFilterSearch = { ...valueSearch }; 

    if (valueSearch.type.length === 0) {
      valueFilterSearch = { ...valueFilterSearch, type: categoryPhone };
    }
    
    if (valueSearch.memory.length === 0) {
      valueFilterSearch = { ...valueFilterSearch, memory: categoryMemory };
    }
    
    const res = await ProductService.getAllProductFilter(valueFilterSearch);
    setProducts(res?.data);
    setLoadingProducts(false);
   }

  return (
    <Loading isLoading={isLoading || loadingProducts}>
      <main className="productall">
        <div className="productall__header">
          <Breadcrumb
            items={[
              {
                title: "Trang chủ",
              },
              {
                title: <span>Tất cả sản phẩm</span>,
              },
            ]}
          />
          <h1 className="productall__title">
            <i className="fa-solid fa-filter"></i>BỘ LỌC
          </h1>
        </div>

        <div className="productall__content">
          <div className="productall__filter">
            <div className="productall__filter__item">
              <CheckboxComponent
                dataCategory={categoryPhoneFilter}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>
            <div className="productall__filter__item">
              <CheckboxComponent
                dataCategory={categoryMemoryFilter}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>

            <div className="productall__filter__item">
              <h1>Giá</h1>
              <Slider
                range
                step={1}
                defaultValue={[1, 100]}
                onChange={handleOnChangePrice}
              />
              <div className="productall__filter__item--result">
                <span>{priceFilter[0]}</span>
                <span>{priceFilter[1]}</span>
              </div>
            </div>

            <button className="productall__filter--button" onClick={handleFilterProduct}>Lọc</button>
          </div>

          <div className="productall__main">
            {products?.map((product, i) => (
              <Card key={i} dataProduct={product} />
            ))}
          </div>
        </div>
      </main>
    </Loading>
  );
}
export default ProductPage;
