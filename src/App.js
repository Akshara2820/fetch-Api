import React, { useState, useEffect, useRef } from 'react'
import './App.css';
import Posts from './components/Posts';
import Pagination from './components/Pagination';
import axios from 'axios';


const colours = ['yellow','#31debb', 'greenyellow', 'purle', '#03adfc','orange', 'yellow','#fc03fc'];

export default function UsersData() {

  const [perPage,setPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [selectedColourIndex, setColourIndex] = useState(0);
  const inputRef = useRef(null)
const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if(posts.length > 0) return
    // https://fakestoreapi.com/products
    fetch('https://dev.xpresscure.com/api/admin/lists_diseases')
      .then((res) => res.json())
      .then((res) => {
        setPosts(res)
        localStorage.setItem('dataKey', JSON.stringify(res))
        setPageCount(Math.ceil(posts.length / perPage))
      })
  },[posts])


  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleDelete =(_id) =>{
    setPosts(posts.filter(p => p._id !== _id))
    localStorage.setItem('dataKey', JSON.stringify(posts.filter(p => p._id !== _id)));
  }

  const handleEdit = (id,edit) =>{ 
      setPosts(posts.map((itm) => {
        if(itm._id === id) {
          return {...itm, disease_name: edit}
          
        } else {
          return itm
        }
      }))
      setShowInput(false);
      localStorage.setItem('dataKey', JSON.stringify(posts.map((itm) => {
        if(itm._id === id) {
          return {...itm, disease_name: edit}
          
        } else {
          return itm
        }
      })));
  }
 

  // useEffect(() => {
  //   console.log("posts", posts)
  // }, [posts])


  const nextColour = () => {
    const newColourIndex = selectedColourIndex + 1;
    if (colours[newColourIndex]) 
        setColourIndex(newColourIndex);
    else
        setColourIndex(0);
}

  return (
    <>
    <div className='container mt-5'>
    {showInput && <input ref={inputRef} className='input-box' type='text' placeholder='Enter Your Desease...' />}
    <table>
    <tr className='text-[24px]'>
      <th style={{backgroundColor: colours[selectedColourIndex]}}>ID</th>
      <th style={{backgroundColor: colours[selectedColourIndex]}}>Department Name</th>
      <th style={{backgroundColor: colours[selectedColourIndex]}}>Department Icon</th>
      <th style={{backgroundColor: colours[selectedColourIndex]}}>Desease Name</th>
      <th style={{backgroundColor: colours[selectedColourIndex]}}>Status</th>
      <th> <button type="button" className='rounded-lg shadow-lg p-2' style={{backgroundColor: colours[selectedColourIndex]}}onClick={nextColour}>Change color</button> </th>
    </tr>
    {currentPosts.map((val, key) => {
      return (
        
        <tr key={key}>
      
        <td> {val._id}</td>
          <td className='text-left'>{val.department_name}</td>
          <td><img className='w-24' src={val.icon} alt='loading'/></td>
          <td>{val.disease_name}</td>
          <td>{val.status}</td>
          <div className='flex gap-5 p-3 text-white mt-4'> 
            <button className='bg-red-600 p-2 rounded-lg shadow-lg  hover:bg-red-800'  onClick={() => handleDelete(val._id)}>Delete</button>
            <button className='bg-green-600 p-2 rounded-lg shadow-lg hover:bg-green-800' 
            // onClick={() =>handleEdit(val._id, inputRef.current.value)}
            onClick={() => 
            {
              if(!showInput) {
                setShowInput(true)
              } else {
                handleEdit(val._id, inputRef.current.value)
              }
            }  
            
            }
            >Edit</button>
          </div>
          
        </tr>
      )
    })}
  </table>
    
   
    <Pagination
      postsPerPage={postsPerPage}
      totalPosts={posts.length}
      paginate={paginate}
    />
  </div>
   
     
    </>
  )
}


