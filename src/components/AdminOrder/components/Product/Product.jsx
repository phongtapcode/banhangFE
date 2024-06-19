import "./Product.scss";

function Product({image,name,amount}){

    return(
        <div className="productitem">
            <div className="productitem__left">
                <img src={image}/>
            </div>
            <div className="productitem__right">
                <span>{name}</span>
                <span>{`x ${amount}`}</span>
            </div>
        </div>
    )
}

export default Product;