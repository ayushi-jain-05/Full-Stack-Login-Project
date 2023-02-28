import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const updateemail = localStorage.getItem("email1");

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [aboutme, setaboutMe] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/fetchdata/${updateemail}`)
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setMobileNumber(res.data.Mobile);
        setDOB(res.data.DateofBirth);
        setGender(res.data.Gender);
        setaboutMe(res.data.aboutme);
        setProfileImage(res.data.profileImage);
      })
      .catch((err) => console.log(err));
  }, [updateemail]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
    }
  };

  useEffect(() => {
    
    axios
      .get("http://localhost:8080/userdata/")
      .then((res) => {
        const { firstName, lastName, mobileNumber, dob, gender,aboutme,image } = res.data;
        setFirstName(firstName);
        setLastName(lastName);
        setMobileNumber(mobileNumber);
        setDOB(dob);
        setGender(gender);
        setaboutMe(aboutme);
        setaboutMe(image);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileImage) {
      formData.append("profileImage", profileImage as File);
    }
  
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("aboutme", aboutme);
    axios
      .patch(`http://localhost:8080/editprofile/${updateemail}`, formData)
      .then((res) => {
        const { firstName, lastName, mobileNumber, dob, gender,aboutme,image } = res.data;
        setFirstName(firstName);
        setLastName(lastName);
        setMobileNumber(mobileNumber);
        setDOB(dob);
        setGender(gender);
        setaboutMe(aboutme);
        setProfileImage(image);
      })
      .catch((err) => console.log(err));
      navigate("/data/profile"); 
  };
  
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobileNumber">Number:</label>
          <input
            type="number"
            className="form-control"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
    <label htmlFor="gender">Gender:</label>
    <select className="form-control" id="gender" value={gender} onChange={e => setGender(e.target.value)}>
      <option value="">--Please select an option--</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
     <div className="form-group">
        <label htmlFor="dob">Birth Date:</label>
     <input type="text" className="form-control" id="dob" value={dob} onChange={e => setDOB(e.target.value)} />
     </div>
     <div className="form-group">
       <label htmlFor="aboutme">About Me:</label>
       <input type="text" className="form-control" id="aboutme" value={aboutme} onChange={e => setaboutMe(e.target.value)} />
     </div>
     <div className="form-group">
    <label htmlFor="profileImage">Profile Image:</label>
    <input name ="profileImage" type="file" onChange={handleImageChange} />
  </div>
     <br></br>
     <button type="submit" className="btn btn-primary">Save</button>
   </form>
     </div>
  )
}
export default Profile









