import './Footer.scss';

function Footer () {

    return(
        <footer className='footer'>
            <div className='footer__top'>
                    <div className='footer__top__item'>
                        <div className='footer__top__item__left'>
                            <img src='https://mauweb.monamedia.net/broshop/wp-content/uploads/2019/03/policy1-300x300.png'/>
                        </div>
                        <div className='footer__top__item__right'>
                            <span>Hỗ trợ 24/24</span>
                            <p>facebook.com/</p>
                        </div>
                    </div>
                    <div className='footer__top__item'>
                        <div className='footer__top__item__left'>
                            <img src='https://mauweb.monamedia.net/broshop/wp-content/uploads/2019/03/policy2-300x300.png'/>
                        </div>
                        <div className='footer__top__item__right'>
                            <span>Hotline</span>
                            <p>1900 1688</p>
                        </div>
                    </div>
                    <div className='footer__top__item'>
                        <div className='footer__top__item__left'>
                            <img src='https://mauweb.monamedia.net/broshop/wp-content/uploads/2019/03/policy3-300x300.png'/>
                        </div>
                        <div className='footer__top__item__right'>
                            <span>Ship hàng hỏa tốc</span>
                            <p>Nhận hàng liền tay</p>
                        </div>
                    </div>
                    <div className='footer__top__item'>
                        <div className='footer__top__item__left'>
                            <img src='https://mauweb.monamedia.net/broshop/wp-content/uploads/2019/03/policy4-300x300.png'/>
                        </div>
                        <div className='footer__top__item__right'>
                            <span>Chất lượng đảm bảo</span>
                            <p>Đổi hàng khi gặp lỗi</p>
                        </div>
                    </div>
            </div>

            <div className='footer__bottom'>
                <p>Thiết kế và lập trình bởi <a>Phong Bá</a></p>
            </div>
        </footer>
    )
}

export default Footer;