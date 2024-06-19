import Card from "../../components/Card/Card";
import Carousel from "../../components/Carousel/Carousel";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import "./HomePage.scss";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

function HomePage() {
  const valueSearch = useSelector((state) => state.valueSearch);
  const searchDebounce = useDebounce(valueSearch, 1000);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const refSearch = useRef();
  //useQuery là một hook từ thư viện React Query, được sử dụng để gọi một hàm hoặc một promise và quản lý trạng thái của dữ liệu kết quả. Nó nhận vào một mảng dependencies, trong đó:
  //Phần tử đầu tiên là một key, được sử dụng để xác định dữ liệu trong bộ nhớ cache của React Query.
  //Phần tử thứ hai là một hàm hoặc promise mà useQuery sẽ gọi để lấy dữ liệu. Trong trường hợp này, đó là fetchProductAll.
  //Phần tử thứ ba là một đối tượng options, trong đó bạn có thể cung cấp các tuỳ chọn như retry và retryDelay.
  const fetchProductAll = async (search) => {
    const res = await ProductService.getAllProduct(search);
    setLoadingProducts(false);
    if (search?.length > 0) {
      setProducts(res);
    } else {
      setProducts(res);
      return res;
    }
  };

  useEffect(() => {
    if (refSearch.current) {
      setLoadingProducts(true);
      fetchProductAll(searchDebounce);
    }
    refSearch.current = true;
  }, [searchDebounce]);
  //retry: Xác định số lần thử lại khi có lỗi xảy ra khi gọi API.
  const { isLoading, data } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProductAll, // Sử dụng queryFn để truyền hàm lấy dữ liệu
    config: { retry: 3, retryDelay: 1000 },
  });

  useEffect(() => {
    setProducts(data);
  }, [data]);

  return (
    <Loading isLoading={loadingProducts}>
      <main className="main">
        <div className="main__content">
          <div className="main__content__title">
              <Carousel />
          </div>
        </div>

        <div className="main__product">
          {products?.data?.map((product, i) => (
            <Card dataProduct={product} key={i}/>
          ))}
        </div>
      </main>
    </Loading>
  );
}

export default HomePage;
