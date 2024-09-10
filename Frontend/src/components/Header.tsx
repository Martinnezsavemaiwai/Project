import '../stylesheet/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="container-head">
            <div className="left-side">
                <div className="logo-box">
                    <div className="img-box">
                        Store<span>&nbsp;Management</span>
                    </div>
                </div>
            </div>
            
            <nav>
                <div className='logout-boxed'>
                    <Link to="/Login" className="logout-box">
                        <img src="/images/icon/account.png" alt="User account" />
                        <div className="text-box">
                            Log-<span>Out</span>
                        </div>
                    </Link>
                </div>
            </nav>
          
        </div>
    );
}

export default Header;
