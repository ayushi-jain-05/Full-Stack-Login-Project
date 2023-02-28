import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  Gender: string;
  DateofBirth: string;
  email: string;
  Mobile: string;
  aboutme: string,
  loginTime: string;
  image: string;
  google_image: string;
}
interface Props {
  userData: UserData[];
  totalResult: number;
  page: number;
  limit: number;
  changePage: (page: string) => void;
  logout: () => void;
}
interface User {
  firstName: string;
  lastName: string;
  email: string;
}


let val=""
export default function UserProfile() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2);
  const [isNext, setisNext] = useState<boolean>(true);
  const [totalResult, setTotalResult] = useState(0);
  const navigate = useNavigate();
 // const [filterdata, setFilterdata] = useState<UserData[]>([]);
  const [query, setQuery] = useState("");
  let [actualData,setActualData]=useState<UserData[]>([]);

 const [lastLoginTime, setLastLoginTime] = useState(localStorage.getItem("lastLoginTime"));
 if (lastLoginTime) {
  const lastLoginDate = new Date(parseInt(lastLoginTime));
  const formattedLastLoginTime = format(lastLoginDate, 'MMM dd, yyyy HH:mm');
  val = formattedLastLoginTime
}

  const logout = () => {
    navigate("/login");
    setUserData([]);
  };

  const getData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchdata?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let temp = await response.json();
    if (temp.length === 0) {
      setisNext(false);
    }
    setActualData(temp.user);
    setUserData(temp.user);
   // setFilterdata(temp.user);
    setTotalResult(Number(temp.totalResults));
  };

  

  //Pagination
  const changePage = (type: string) => {
    if (type === "prev") {
      setPage((old) => old - 1);
    } else if (type === "next") {
      setPage((old) => old + 1);
    }
  };

  useEffect(() => {
    getData();
  }, [page]);


  const editprofile = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/profile");
  };




  // Search Functionality
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const getSearch = event.target.value;
   let data=[];
   
   if (getSearch.length > 0) {
   
     const searchdata = actualData.filter((item) =>
        item.firstName.toLowerCase().includes(getSearch.toLowerCase()) ||
        item.lastName.toLowerCase().includes(getSearch.toLowerCase()) ||
        item.Mobile.toString().includes(getSearch.toString()) ||
        item.email.toLowerCase().includes(getSearch.toLowerCase())
      );

      console.log("searchdata: ",searchdata)
      data=searchdata;
    } else {
          data=actualData;
    }

    setQuery(getSearch);
    setUserData([...data]);
  };

 
  return (
    <div className="App">
      <h1 className="display-4 text-center my-5">User Details</h1>
      <div className="topnav" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div className="d-flex justify-content-between align-items-center">
  <button className="btn btn-primary" onClick={(e: React.MouseEvent<HTMLButtonElement>) => editprofile(e)}>Edit Profile</button>
  <span style={{marginLeft: '500px'}}><p className="text-muted mb-0" style={{textAlign: 'right'}}>Last Login Time: {val}</p></span></div> 
      </div>
     <br></br>
      <div className="ui search">
      <div className="input-group mb-3">
  <input type="text" className="form-control" placeholder="Search User" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)} />

</div>
      </div>
      <br></br>
      <table className="table" id="details">
  <thead className="thead-dark">
    <tr>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Gender</th>
      <th scope="col">Date of Birth</th>
      <th scope="col">Email</th>
      <th scope="col">Mobile Number</th>
      <th scope="col">About Me</th>
      <th scope="col">Profile Picture</th>
    </tr>
  </thead>
  <tbody>
    {userData.map((el) => (
      <tr key={el._id}>
        <td>{el.firstName}</td>
        <td>{el.lastName}</td>
        <td>{el.Gender}</td>
        <td>{el.DateofBirth}</td>
        <td>{el.email}</td> 
        <td>{el.Mobile}</td>
        <td>{el.aboutme}</td>
        <td><img src={el.image?`http://localhost:8080/${el.image}`:el.google_image} alt="profile" width="100" height="100" /></td>

      </tr>
    ))}
  </tbody>
</table>

      <br></br>
        <div className="btn-group" role="group" aria-label="Pagination buttons">
  <button type="button" className="btn btn-secondary" onClick={() => changePage("prev")} disabled={page === 1}>
    Previous
  </button>
  <button type="button" className="btn btn-secondary" onClick={() => changePage("next")} disabled={page + 1 > Math.ceil(totalResult / limit)}>
    Next
  </button>
</div>

      <button className="btn btn-danger  bottom mt-3  d-flex justify-content-center" style={{ width: "100px" }} onClick={logout}>
      Log Out
     </button>
    </div>
    
  
  )
}
