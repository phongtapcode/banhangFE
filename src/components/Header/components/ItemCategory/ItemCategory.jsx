import './ItemCategory.scss';
import { useNavigate } from "react-router-dom";

function ItemCategory({ data }) {
  const navigate = useNavigate();

  return (
    <div className="itemcategory">
      <div className="itemcategory__left">
        <span><i className={data.iconMain}></i>{data.title}</span>
      </div>
      {data.iconChevron && (
        <div className="itemcategory__iconchev">
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      )}
      {data.iconChevron && (
        <ul className="itemcategory__treemenu">
        {data.children.map((item,index)=>(<li key={index}><a onClick={() => navigate(item.href)}>{item.name}</a></li>))}
        </ul>
      )}
    </div>
  );
}

export default ItemCategory;
