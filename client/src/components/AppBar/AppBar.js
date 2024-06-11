import React, { useState, useEffect } from 'react'
import {Link, useNavigate, useLocation} from "react-router-dom"
import styles from '../AppBar/styles'
import Logo from "../../images/logo1.png";
import {Layout, Image, Typography, Button, Avatar} from "antd";
import {useDispatch} from "react-redux"
import { LOGOUT } from '../../constants/actionTypes';

const {Title} = Typography;
const {Header} = Layout;
function AppBar() {
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  
  useEffect(() => {
    const token = user?.token;
    if(token){
        
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location, user?.token]);

  const logout = () => {
    dispatch({type: LOGOUT});
    navigate("/");
    setUser(null);
  }

  return (
    <Header style={styles.header}>
        <Link to="/">
            <div style={styles.homeLink}>
                <Image style={styles.image} width="45" preview="false" src={Logo}/>
                &nbsp;
                <Title style={styles.title}>Movie Playlist</Title>
            </div>
        </Link>
        {!user ? (
            <Link to="/authform">
                <Button htmlType='button' style={styles.button}>
                    Log In
                </Button>
            </Link>
            
        ):(
            <>
                <div style={styles.userInfo}>
                    <Avatar style={styles.avatar} alt="username" size="large">
                        {user?.result?.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Title style={styles.title} level={4}>
                        {user?.result?.username}
                    </Title>

                    
                    
                </div>
                <div>
                    <Link to="/authform">
                        <Button onClick={logout} htmlType='button' style={styles.button}>
                            Log Out
                        </Button>
                    </Link>
                </div>
            </>    
        )}
    </Header>
  )
}

export default AppBar