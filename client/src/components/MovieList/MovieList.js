import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spin, Input, Button, message } from "antd";
import Movie from '../Movie';
import { useSelector, useDispatch } from 'react-redux';
import { getMovie, getMovies, createMovie } from "../../actions/movies";
import axios from "axios";  
import styles from './styles';

const MovieList = ({ setSelectedId }) => {
  const dispatch = useDispatch();
  const [pubMovies, setPubMovies] = useState([]);
  const [showUserMovies, setShowUserMovies] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermUser, setSearchTermUser] = useState('');
  const [form] = Form.useForm();
  const movies = useSelector((state) => state.movies);
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userId, setUserId] = useState(user?.result?.id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve userId from local storage
    setUserId(user?.result?.id);

    if (userId) {
      // Set the userId state with the value retrieved from local storage
      setUserId(userId);
      // Dispatch the action with the retrieved userId
      dispatch(getMovies(userId));
    } else {
      // If userId is null, you might want to clear the movies state here
      // Assuming you have a CLEAR_MOVIES action type
      dispatch({ type: 'CLEAR_MOVIES' });
    }
  }, [dispatch]);

  const handleShowAll = () => {
    if (!searchTerm) {
      return;
    } else {
      setLoading(true);
      axios.get(`https://www.omdbapi.com/?s=${searchTerm}&apikey=de0819be`)
        .then((response) => {
          setPubMovies(response.data.Search);
          setShowUserMovies(false);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        }); 
    }
  };

  const handleSearch = () => {
    if (!searchTermUser) {
      return ;
    } else {
      dispatch(getMovie(userId, searchTermUser));
    }
  };

  const handleShowUser = () => {
    dispatch(getMovies(userId));
    setShowUserMovies(true);
    setPubMovies([]);
  };

  const handleAddMovie = (imdbID) => {
    axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=de0819be`)
      .then((response) => {
        const data = response.data;

        form.setFieldsValue({
          name: data.Title,
          starcast: data.Actors,
          movieStatus: data.Director, // Set a default value or adjust accordingly
          movie: data.imdbRating,
          remarks: data.Genre,
          image: data.Poster
        });

        form.submit();
      })
      .catch((error) => {
        message.error('Failed to fetch movie details.');
      });
  };

  const onSubmit = (formValues) => {
    try {
      dispatch(createMovie({ ...formValues, userId }))
        .then((response) => {
          if (response === 201) {
            message.success('Movie added to your playlist.');
          } else if (response === 202) {
            message.info('Movie with the same name already exists.');
          }
        })
        .catch((error) => {
          message.error('Failed to add movie to your playlist.');
        });
    } catch (error) {
      message.error('Failed to add movie to your playlist.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
        {user && (
          <div>
            <Input 
              placeholder="Show Movies from OMDB" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ width: 200, marginRight: 10 }}
            />
            <Button type="primary" onClick={handleShowAll} style={{ marginRight: 10 }}>Search</Button>
          </div>
        )}
        {user && (
          <div>
            <Input 
              placeholder="Show from User's Playlist" 
              value={searchTermUser} 
              onChange={(e) => setSearchTermUser(e.target.value)} 
              style={{ width: 200, marginRight: 10 }}
            />
            <Button type="primary" onClick={handleSearch} style={{ marginRight: 10 }}>Search</Button>
          </div>
        )}
        {user && (
          <Button onClick={handleShowUser}>Show All User's Movies</Button>
        )}
      </div>

      <div className="container">
        {showUserMovies ? (
          <Row gutter={[20, 20]} style={styles.rows}>
            {movies && movies.map((movie) => (
              <Col key={movie.id} xs={24} sm={24} md={8} lg={8}>
                <Movie setSelectedId={setSelectedId} movie={movie} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row gutter={[20, 20]}>
            {pubMovies.length ? (
              pubMovies.map((value, index) => (
                <Col key={index} xs={24} sm={24} md={8} lg={8}>
                  <div className="card" style={{ width: "100%" }}>
                    <img src={value.Poster} className="card-img-top" alt={value.Title} />
                    <div className="card-body">
                      <h3 className="card-genre">{value.Title}</h3>
                      <h3 className="card-Actor">{value.Year}</h3>
                      <div style={{ marginBottom: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={() => handleAddMovie(value.imdbID)}>Add Movie to Playlist</Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <div style={{ textAlign: "center", width: "100%" }}>
                {loading ? <Spin size="large" /> : <p>No movies found.</p>}
              </div>
            )}
          </Row>
        )}
      </div>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout='horizontal'
        size="middle"
        onFinish={onSubmit}
        style={{ display: 'none' }} // Hide the form as it should not be visible
      >
        <Form.Item name="name" label="Movie Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="starcast" label="StarCast" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="movieStatus" label="MovieStatus" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="movie" label="Rating" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="remarks" label="Remarks" rules={[{ required: true }]}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="image" label="Movie Cover URL" rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}>
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default MovieList;






// import React, { useState } from 'react';
// import { Row, Col, Spin, Input, Button } from "antd";
// import Movie from '../Movie';
// import { useSelector, useDispatch } from 'react-redux';
// import { getMovie, getAllMovies } from "../../actions/movies"; // Import getAllMovies action
// import axios from "axios";  
// import styles from './styles';

// const MovieList = ({ setSelectedId }) => {
//   const dispatch = useDispatch();
//   const[pubmovie,setpubmovie]=useState([])
//   const [searchTerm, setSearchTerm] = useState('');
//   const movies = useSelector((state) => state.movies);
//   const user = JSON.parse(localStorage.getItem("profile"));
//   const userId = user?.result?.id;

//   const handleSearch = () => {
//     dispatch(getMovie(userId, searchTerm));
//   };

//   const handleShowAll = () => {
//     // dispatch(getAllMovies(userId)); // Dispatch the action to fetch all movies
//     axios.get("https://www.omdbapi.com/?s=kabhi&apikey=2f92b18f")
//     .then((response)=>{
//       console.log(response.data.Search);
//       setpubmovie(response.data.Search)
//     })
//   };
//   return (
//     <div>
//     <div style={{ marginBottom: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
//     <Button onClick={handleShowAll}>Show All Movies</Button>
//     </div>

//     <div className="container">
//       <div className="row">
//         {
//           pubmovie.map((value,index)=>{
//             return (
//               <div className="col-3">
//               <div class="card" style={{width: "18rem" }}>
//               <img src={value.Poster} className="card-img-top" alt="..."/>
//                <div class="card-body">
//                 <h3 class="card-title">{value.Year}</h3>
//                 <h4 class="card-text">{value.Title}</h4>
//               </div>
//               </div>
    
//             </div>
//             )
//           })
//         }
//       </div>
//     </div>
//     </div>
//   );
  //   <div class="card" style="width: 18rem;">
  // <div class="card-body">
  //   <h5 class="card-title">Card title</h5>
  //   <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
  //   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  //   <a href="#" class="card-link">Card link</a>
  //   <a href="#" class="card-link">Another link</a>
  // </div>
  // </div>
  // );

  // return !movies.length ? (
  //   <div style={{ textAlign: "center" }}>
  //     <Spin size="large" />
  //   </div>
  // ) : (
  //   <div>
  //     <div style={{ marginBottom: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
      
  //    <Button onClick={handleShowAll}>Show All Movies</Button>
  //    <div>   <Input 
  //         placeholder="Search for a movie" 
  //         value={searchTerm} 
  //         onChange={(e) => setSearchTerm(e.target.value)} 
  //         style={{ width: 200, marginRight: 10 }}
  //       />
  //       <Button type="primary" onClick={handleSearch} style={{ marginRight: 10 }}>Search</Button>
  //       </div>
  //     </div>
  //     <Row gutter={[20, 20]} style={styles.rows}>
  //       {
  //         movies.map((movie) => {
  //           return (
  //             <Col key={movie.id} lg={12} xl={8} xxl={6}>
  //               <Movie setSelectedId={setSelectedId} movie={movie} />
  //             </Col>
  //           );
  //         })
  //       }
  //     </Row>
  //   </div>
  // );
// };

// export default MovieList;





// import React from 'react'
// import {Row, Col, Spin} from "antd"
// import movie from '../movie'
// import { useSelector } from 'react-redux'
// import styles from './styles'

// const MovieList = ({setSelectedId}) => {
//   const movies = useSelector((state)=>state.movies)
//   // const id = []
//   console.log(movies)

//   return !movies.length ? 
//   <div style={{textAlign:"center"}}>
//     <Spin size="large"/>
//   </div> :
//   (
    
//     <Row gutter={[20, 20]} style={styles.rows}>
//         {
//           movies.map((movie) => {
//             return (
//               <Col key ={movie.id} lg={12} xl={8} xxl={6}>
//                 <movie setSelectedId={setSelectedId} movie={movie}/>
//               </Col>
//             )
//           })
//         }
//     </Row>
//   )
// }

// export default MovieList



// import React from 'react'
// import {Row, Col, Spin, Input} from "antd" // Assuming you are using Ant Design
// import Movie from '../Movie';
// import { useSelector } from 'react-redux'
// import styles from './styles'
// import {getMovie} from "../../actions/movies";
// import { useDispatch } from "react-redux";

// const MovieList = ({setSelectedId}) => {
//   const dispatch = useDispatch();
//   const movies = useSelector((state)=>state.movies)
  
//   // const id = []
//   const user = JSON.parse(localStorage.getItem("profile"));
//   const userId = user?.result?.id;
//   console.log("user: ",userId);
//   console.log(movies)
//   // const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (value) => {
//     // Handle search logic here
//     console.log("value",value);
//     dispatch(getMovie(userId,value));
//   }

//   return (
//     <div>
//       <div style={{ marginBottom: '20px' }}> {/* Styling to add margin between button and row */}
//         <Input.Search placeholder="Search" onSearch={handleSearch} style={{ marginRight: '10px' }} />
//       </div>
//       {
//         !movies.length ? 
//         <div style={{textAlign:"center"}}>
//           <Spin size="large"/>
//         </div> :
//         (
//           <Row gutter={[20, 20]} style={styles.rows}>
//             {
//               movies.map((movie) => {
//                 return (
//                   <Col key ={movie.id} lg={12} xl={8} xxl={6}>
//                     <movie setSelectedId={setSelectedId} movie={movie}/>
//                   </Col>
//                 )
//               })
//             }
//           </Row>
//         )
//       }
//     </div>
//   )
// }

// export default MovieList




// import React from 'react'
// import {Row, Col, Spin,Input} from "antd"
// import Movie from '../Movie'
// import { useSelector } from 'react-redux'
// import { useDispatch } from "react-redux";
// import {getMovie} from "../../actions/movies";
// import styles from './styles'


// const MovieList = ({setSelectedId}) => {
//   const dispatch = useDispatch();
//   const movies = useSelector((state)=>state.movies)
//   // const id = []
//   console.log(movies)
//   const user = JSON.parse(localStorage.getItem("profile"));
//   const userId = user?.result?.id;
//   console.log("user: ",userId);
//   console.log(movies)
//   // const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (value) => {
//     // Handle search logic here
//     console.log("value",value);
//     dispatch(getMovie(userId,value));
//   }


//   return (
//     <div>
//       <div style={{ marginBottom: '20px' }}> {/* Styling to add margin between button and row */}
//         <Input.Search placeholder="Search" onSearch={handleSearch} style={{ marginRight: '10px' }} />
//       </div>
//       {
//         !movies.length ? 
//         <div style={{textAlign:"center"}}>
//           <Spin size="large"/>
//         </div> :
//         (
//           <Row gutter={[20, 20]} style={styles.rows}>
//             {
//               movies.map((movie) => {
//                 return (
//                   <Col key ={movie.id} lg={12} xl={8} xxl={6}>
//                     <movie setSelectedId={setSelectedId} movie={movie}/>
//                   </Col>
//                 )
//               })
//             }
//           </Row>
//         )
//       }
//     </div>
//   )
// }

// export default MovieList



// import React from 'react'
// import {Row, Col, Spin} from "antd"
// import Movie from '../Movie'
// import { useSelector } from 'react-redux'
// import styles from './styles'

// const MovieList = ({setSelectedId}) => {
//   const movies = useSelector((state)=>state.movies)
//   // const id = []
//   console.log(movies)

//   return !movies.length ? 
//   <div style={{textAlign:"center"}}>
//     <Spin size="large"/>
//   </div> :
//   (
//     <Row gutter={[20, 20]} style={styles.rows}>
//         {
//           movies.map((movie) => {
//             return (
//               <Col key ={movie.id} lg={12} xl={8} xxl={6}>
//                 <Movie setSelectedId={setSelectedId} movie={movie}/>
//               </Col>
//             )
//           })
//         }
//     </Row>
//   )
// }

// export default MovieList

