import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import MovieList from "../MovieList";
import MovieForm from "../MovieForm";
import { Layout } from "antd";
import styles from "./styles";
import {getMovies} from "../../actions/movies";

const {Sider, Content} = Layout;
const Home = () => {
    const dispatch = useDispatch();
    const [selectedId,setSelectedId] = useState(null);
    const user = JSON.parse(localStorage.getItem("profile"));
    const userId = user?.result?.id;
    useEffect(()=>{
        dispatch(getMovies(userId));
    }, [dispatch,userId]);
    
    return (
        <Layout>
            <Sider style={styles.sider} width={400}>
                <MovieForm selectedId={selectedId} setSelectedId={setSelectedId}/>
            </Sider>
            <Content style={styles.content}>
                <MovieList setSelectedId={setSelectedId}/>
            </Content>
        </Layout>
    )
}

export default Home;