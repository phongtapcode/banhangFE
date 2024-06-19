import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function DefaultComponent({children}){
    return(
        <>
            <Header/>
            {children}
            <Footer/>
        </>
    )
}

export default DefaultComponent;