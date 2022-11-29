# RH_Task 

link : https://rh-task.vercel.app/ . 

# If link is not working, you may try...  

1. `npm i` to install packages I used.  
2. `npm run dev` to run server   
3. visit `http://localhost:4000/graphql` . 
4. use query 
` {
  getProfile(id: "2")  {
    id,
    user{
      dateofbirth
    }
    location,
  }
}
`
