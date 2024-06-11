import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Card, Form, Input, Typography, Button, Select} from "antd"
import FileBase64 from "react-file-base64"
import styles from './styles'
import {createMovie, editMovie} from '../../actions/movies'
import { Link } from "react-router-dom"
import {Rate } from 'antd';

const {Title} = Typography;

function MovieForm({ selectedId, setSelectedId }){
  const movie = useSelector((state)=> selectedId ? state.movies.find(movie => movie.id === selectedId): null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?.id;

  const onSubmit = (formValues) => {
    // console.log("value",formValues);
    selectedId ?
    dispatch(editMovie(selectedId, {...formValues, userId})) :
    dispatch(createMovie({...formValues, userId}));
    reset();
  };

  useEffect(()=>{
    if(movie){
      form.setFieldsValue(movie);
    }
  }, [movie, form]);

  const reset = () => {
    form.resetFields();
    setSelectedId(null);
  }
if(!user){
  return (
    <Card style={styles.formCard}>
      <Title level={4}>
        <span style={styles.formTitle}>
        Welcome to Your Movie Playlist Creator
        </span><br/>
        Please <Link to="/authform">login</Link> or {" "}
        <Link to="/authform">register</Link> to add a movie.
      </Title>
    </Card>
  );
}

  return (
    <Card
      style = {styles.formCard}
      title={
        <Title level={4} style={styles.formTitle}>
          {selectedId ? "Edit" : "Add"} Movie (YourSelf)
        </Title>
      }
    >
      <Form
        form={form}
        labelCol={{span: 6}}
        wrapperCol={{span: 16}}
        layout='horizontol'
        size="middle"
        onFinish={onSubmit}
      >
        
        <Form.Item name="name" label="Movie Name" style={styles.label} rules={[{required: true}]}>
          <Input allowClear/>
        </Form.Item>
        
        <Form.Item name="starcast" label="StarCast" style={styles.label} rules={[{required: true}]}>
          <Input allowClear/>
        </Form.Item>
        
        <Form.Item name="movieStatus" label="MovieStatus" style={styles.label} rules={[{required: true}]}>
         <Input allowClear/>
        </Form.Item>
        {/* <Form.Item name="movie" label="Movie" style={styles.label} rules={[{required: true}]}>
        <Select placeholder="Select a movie" allowClear>
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </Select>
        </Form.Item> */}
        <Form.Item name="movie" label="Rating" style={styles.label} rules={[{required: true}]}>
        <Input allowClear/>
</Form.Item>
        <Form.Item name="remarks" label="Remarks" style={styles.label} rules={[{required: true}]}>
          <Input.TextArea allowClear autoSize={{minRows: 2, maxRows: 6}}/>
        </Form.Item>
        {/* <Form.Item name="image" label="Movie Cover" style={styles.label} rules={[{required: true}]}>
          <FileBase64
            type="file"
            multiple={false}
            onDone={(e)=>{
              form.setFieldsValue({
                image: e.base64
              })
            }}
          />
        </Form.Item> */}
           <Form.Item name="image" label="Movie Cover" style={styles.label} rules={[{ required: true, type: 'url', message: 'Please enter a valid URL' }]}>
        <Input allowClear placeholder="Enter image URL" />
      </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 16,
            offset: 6
          }}
          >
          <Button type="primary" style={styles.button} block htmlType='submit'>
            Add Movie
          </Button>
          </Form.Item>
        {!selectedId ? null : 
          <Form.Item
          wrapperCol={{
            span: 16,
            offset: 6
          }}
          >
          <Button type="primary" style={styles.button} block htmlType='button' onClick={reset}>
            Discard
          </Button>
          </Form.Item>
        }
      </Form>
    </Card>
  )
}

export default MovieForm