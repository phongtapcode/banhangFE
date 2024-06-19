import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import "./Card.scss";

function stringToNumber(str) {
  var num = parseInt(str);
  return num;
}

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function Card({ dataProduct }) {
 
  return (
    <div className="cardproduct">
      <div className="cardproduct__img">
        <span>
          <img src={dataProduct.image} />
        </span>
        <div className="cardproduct__label">
          <span className="badge bg-danger">{`Giảm ${dataProduct.discount}%`}</span>
        </div>
      </div>

      <div className="cardproduct__infor">
        <h1>{dataProduct.name}</h1>

        <div className="cardproduct__infor__price">
          <div className="cardproduct__infor__price--newprice">
            {`${numberToString(
              Math.ceil(
                (stringToNumber(dataProduct.price) *
                  (100 - dataProduct.discount)) /
                  100
              )
            )}₫`}
          </div>
          <div className="cardproduct__infor__price--oldprice">
            {`${numberToString(stringToNumber(dataProduct.price))}₫`}
          </div>
        </div>

        <div className="cardproduct__infor__config">
          <Tooltip placement="top" title={"cpu"}>
            <div>
              <i className="fa-solid fa-sd-card"></i>
              {dataProduct.cpu}
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"screen"}>
            <div>
              <i className="fa-solid fa-mobile-screen"></i>
              {dataProduct.screen + " inch"}
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"ram"}>
            <div>
              <i className="fa-solid fa-microchip"></i>
              {dataProduct.ram+" GB"}
            </div>
          </Tooltip>
          <Tooltip placement="top" title={"memory"}>
            <div>
              <i className="fa-solid fa-memory"></i>
              {dataProduct.memory + " GB"}
            </div>
          </Tooltip>
        </div>
      </div>

      <button className="cardproduct__buttonbuy">
        <a href={`/detail/${dataProduct._id}`}>MUA NGAY</a>
      </button>
    </div>
  );
}

export default Card;
