import React, { useState, useEffect, useRef } from 'react'
import './App.css';
import Posts from './components/Posts';
import Pagination from './components/Pagination';
import axios from 'axios';


export default function UsersData() {

  const [perPage,setPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const inputRef = useRef(null)
const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    if(posts.length > 0) return

    fetch('https://fakestoreapi.com/products')
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

  const handleDelete =(id) =>{
    setPosts(posts.filter(p => p.id !== id))
    localStorage.setItem('dataKey', JSON.stringify(posts.filter(p => p.id !== id)));
  }

  const handleEdit = (id,edit) =>{ 
      setPosts(posts.map((itm) => {
        if(itm.id === id) {
          return {...itm, title: edit}
          
        } else {
          return itm
        }
      }))
      setShowInput(false);
      localStorage.setItem('dataKey', JSON.stringify(posts.map((itm) => {
        if(itm.id === id) {
          return {...itm, title: edit}
          
        } else {
          return itm
        }
      })));
  }
 

  useEffect(() => {
    console.log("posts", posts)
  }, [posts])

  return (
    <>
    <div className='container mt-5'>
    {showInput && <input ref={inputRef} className='border border-emerald-500' type='text' />}
    <table>
    <tr className='text-[24px]'>
      <th>ID</th>
      <th>Department Name</th>
      <th>Department Icon</th>
      <th>Desease Name</th>
      <th>Status</th>
    </tr>
    {currentPosts.map((val, key) => {
      return (
        
        <tr key={key}>
      
        <td> {val.id}</td>
          <td className='text-left'>{val.title}</td>
          <td><img className='w-24' src={val.icon} alt='loading'/></td>
          <td>{val.disease_name}</td>
          <td>{val.status}</td>
          <div className='flex gap-5 p-3 text-white'> 
            <button className='bg-red-600 p-2 rounded-lg shadow-lg  hover:bg-red-800'  onClick={() => handleDelete(val.id)}>Delete</button>
            <button className='bg-green-600 p-2 rounded-lg shadow-lg hover:bg-green-800' 
            // onClick={() =>handleEdit(val.id, inputRef.current.value)}
            onClick={() => 
            {
              if(!showInput) {
                setShowInput(true)
              } else {
                handleEdit(val.id, inputRef.current.value)
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


