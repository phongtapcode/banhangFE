import { useEffect, useState } from "react";
import { DatePicker, Button, Table } from "antd";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import * as UserService from "../../services/UserService";
import RevenueItem from "./components/RevenueItem/RevenueItem";
import Loading from "../Loading/Loading";
import "./AdminRevenue.scss";

const disabledDate = (current) => {
  // Can not select future months
  return current && current > dayjs().endOf("month");
};

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function AdminRevenue() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [allBillFilter, setAllBillFilter] = useState([]);
  const [dataRevenue, setDataRevenue] = useState({
    totalMoney: 0,
    totalBill: 0,
    billComplete: 0,
    totalUser: "phong",
  });

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const mutationFilterOrder = useMutation({
    mutationFn: (dataFilterOrder) => {
      const { month } = dataFilterOrder;
      return OrderService.getOrderFilter(month);
    },
  });

  const { data: dataFilter, isPending: isLoadingFilterOrder } =
    mutationFilterOrder;

  const mutationFilterUser = useMutation({
    mutationFn: (data) => {
      const { month } = data;
      return UserService.getAllUserFilter(month);
    },
  });

  const { data: dataFilterUser, isPending: isLoadingFilterUser } =
    mutationFilterUser;

  useEffect(() => {
    setDataRevenue({...dataRevenue,["totalUser"]: dataFilterUser?.data?.length || 0})
  },[dataFilterUser])

  useEffect(() => {
    setAllBillFilter(dataFilter);
    const totalRevenue = dataFilter?.data?.reduce(
      (total, currentValue) => {
        if (currentValue.isDelivered === "Đã nhận được hàng") {
          total.totalMoney += currentValue.totalPrice;
          total.totalBillComplete++;
        }
        return total;
      },
      { totalMoney: 0, totalBillComplete: 0 }
    );

    if (dataFilter) {
      setDataRevenue({
        totalMoney: totalRevenue?.totalMoney,
        totalBill: dataFilter?.data?.length,
        billComplete: totalRevenue?.totalBillComplete,
        totalUser: dataFilterUser?.data?.length
      });
    }
  }, [dataFilter]);

  const handleFilter = () => {
    if (selectedMonth) {
      const formattedMonth = selectedMonth.format("YYYY-MM");
      mutationFilterOrder.mutate({
        month: formattedMonth,
      });

      mutationFilterUser.mutate({
        month: formattedMonth,
      });
    } else {
      mutationFilterOrder.mutate({
        month: "no",
      });

      mutationFilterUser.mutate({
        month: "no",
      });
    }
  };

  return (
    <Loading isLoading={isLoadingFilterOrder || isLoadingFilterUser}>
      <div className="revenue">
        <h2>Thống kê doanh thu</h2>
        <div className="revenue__filter">
          <DatePicker
            picker="month"
            disabledDate={disabledDate}
            onChange={handleMonthChange}
            placeholder="Chọn tháng"
          />
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>

        <div className="revenue__infor">
          <RevenueItem
            title="Tổng doanh thu"
            value={numberToString(dataRevenue?.totalMoney)}
            icon="fa-money-bill-trend-up"
            colorIcon="green"
          />
          <RevenueItem
            title="Tổng đơn hàng"
            value={numberToString(dataRevenue?.totalBill)}
            icon="fa-money-bill"
            colorIcon="violet"
          />
          <RevenueItem
            title="Hoàn thành"
            value={numberToString(dataRevenue?.billComplete)}
            icon="fa-money-bill-transfer"
            colorIcon="orange"
          />
          <RevenueItem
            title="Tài khoản đã tạo"
            value={dataRevenue?.totalUser}
            icon="fa-users-viewfinder"
            colorIcon="black"
          />
        </div>
      </div>
    </Loading>
  );
}

export default AdminRevenue;
