import Restro from "./restroCard";
import { useState,useEffect } from "react";
import Shimmer from "./shimmers/shimmer";
 import Notfound from "./shimmers/notfound";
import useOnlineStatus from "./utils/useOnlineStatus";
import { RESTRO_API } from "./utils/constants";
import { Link } from "react-router-dom";

const filterData=(searchTxt,listOfRestaurants)=>{
  const filterData = listOfRestaurants.filter((restaurant)=>restaurant?.info?.name?.toLowerCase().includes(searchTxt.toLowerCase()));
  return filterData;
};

const Body=()=>{
     
  const [searchTxt,setSearchTXt]=useState("craving anything specific?");
    const [listOfRestaurants,setListOfRestaurants]=useState([]);
    const [filteredList,setFilteredList]=useState([]);

    const Fetchy = async () => {
      try {
          const response = await fetch(RESTRO_API);
          
          if (!response.ok) {
              throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
  
          const json = await response.json();
  
          console.log(json);
          setListOfRestaurants(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
          setFilteredList(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

      useEffect(() => {
        Fetchy();
    }, []);

    const onlineStatus=useOnlineStatus();
    if(onlineStatus===false){
      return(
        <h1>Sorry,you are Offline!!Please check your internet connection!!</h1>
      )
    }


      return  listOfRestaurants.length===0?<Shimmer/>:(
        <>
        <div className="search-container">
            <div className="search-box">
      <input type="text" placeholder="Search..." value={searchTxt}  onChange={(e)=>{
        setSearchTXt(e.target.value);
      }}/>

      <button onClick={()=>{
        const data = filterData(searchTxt,listOfRestaurants);
        setFilteredList(data);
      }}>Search</button>
    </div>
    </div>
    <div className="hoot">

    { filteredList.length === 0 ? <Notfound/> :
  (
    filteredList.map((restaurant) => (
      <Link className="nodecors"to={"/restaurant/"+restaurant.info.id} key={restaurant.info.id}>
        {console.log(restaurant.info.id)}
      <Restro  Resdata={restaurant} />
      </Link>
    ))
  )
}
</div>

              </>
            
    )
  
};


export default Body;