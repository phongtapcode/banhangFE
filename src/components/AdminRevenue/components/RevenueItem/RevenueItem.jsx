import "./RevenueItem.scss";

function RevenueItem({ title, value, icon, colorIcon }) {
  return (
    <div className="revenueitem">
      <div className="revenueitem__icon">
        <i className={`fa-solid ${icon}`} style={{color: colorIcon}}></i>
      </div>
      <span className="revenueitem__title">{title}</span>
      <span className="revenueitem__value">{value}</span>
    </div>
  );
}

export default RevenueItem;
