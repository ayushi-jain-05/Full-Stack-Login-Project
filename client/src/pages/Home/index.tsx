import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import Navbar  from '../Navbar/index.js';
import Spinner from 'react-bootstrap/Spinner';
import { googleLogout } from "@react-oauth/google";
import { UserData } from "../../interfaces.js";

let val=""
export default function UserProfile() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);
  const [isNext, setisNext] = useState<boolean>(true);
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filterdata, setFilterdata] = useState<number>(1);       //searchpage
  const [query, setQuery] = useState("");                       //searching string
  const [search,setSearch] = useState<string>("")
  let [actualData,setActualData]=useState<UserData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

  //LastLoginTime
 const [lastLoginTime, setLastLoginTime] = useState(localStorage.getItem("lastLoginTime"));
 if (lastLoginTime) {
  const lastLoginDate = new Date(parseInt(lastLoginTime));
  const formattedLastLoginTime = format(lastLoginDate, 'MMM dd, yyyy HH:mm');
  val = formattedLastLoginTime
}
//Logout Functionality
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/");
    setUserData([]);
  };

  const getData = async () => {
    try{
    setLoading(true);
    setPage(filterdata);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchdata`,
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
    setTotalResult(Number(temp.totalResults));
  }
  catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
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
  }, []);

//Update Profile
  const editprofile = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/profile");
  };

  //Search Reset
  const onClickReset =() =>{
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = "";
    }
    setSearch("");
    getData();
  }

  //Searching
  const getSearchData = async () => {
    setLoading(true);
     setFilterdata(page);
     setPage(1);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/fetchsearchdata/${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let temp = await response.json();
    setUserData(temp.user)
    setTotalResult(Number(temp.totalResults))
    setLoading(false)
    }
  return (
    <>
    <Navbar/>
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    
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
<input type="text" ref = {inputRef} className="form-control" placeholder="Search User from First Name, Last Name, Email and Mobile Number"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
<button
                className="btn btn-primary "
                type="submit"
                style={{ width: "100px", height: "50px" }}
                onClick={getSearchData}
              >
                Search
              </button>
              <button
                className="btn btn-danger "
                type="submit"
                style={{ width: "100px", height: "50px" }}
                onClick={onClickReset} >
                Reset
              </button>
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
    {userData.slice(startIndex,endIndex).map((el) => (
      <tr key={el._id}>
        <td>{el.firstName}</td>
        <td>{el.lastName}</td>
        <td>{el.Gender}</td>
        <td>{el.DateofBirth}</td>
        <td>{el.email}</td> 
        <td>{el.Mobile}</td>
        <td>{el.aboutme}</td>
        <td><img src={el.image?`${process.env.REACT_APP_API_URL}/${el.image}`:el.google_image} alt="profile" width="100" height="100" /></td>
      </tr>
    ))}
  </tbody>
</table>
      <br></br>
      <h5>Total users: {totalResult}</h5>
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
    </>
    )}
