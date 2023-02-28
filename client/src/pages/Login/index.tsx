import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import styles from "./styles.module.css";

interface UserDetails {
  mobileNumber: string;
  dob: string;
  gender: string;
  aboutme: string;
  loginTime: string;
}

interface Profile {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
 const [user, setUser] = useState<any>();
  const [profile, setProfile] = useState<Profile>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [aboutme, setaboutMe] = useState('');
  const [gotDetail, setGotDetail] = useState<boolean>();

  const googleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userDetails: UserDetails = {
      mobileNumber,
      dob,
      gender,
      aboutme,
      loginTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
      ...profile!,
    };
    axios.post('http://localhost:8080/userdata', userDetails);
    console.log('done axios');
    navigate('/data/profile');
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json',
          },
        })
        .then(async (res) => {
          //avoid duplicate entries
         
          window.localStorage.setItem('email', res.data.email);
          localStorage.setItem('email1', res.data.email);

          const now = new Date().getTime();
          localStorage.setItem('lastLoginTime', now.toString());

          let subres = await axios.get(`http://localhost:8080/getuser?email=${res.data.email}`);

          if (subres?.data?.Gender) {
            setGotDetail(true);
          } else {
            setGotDetail(false);
          }
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    
    <div >
      {!user?.access_token && (
        <div>
          <h1 className={styles.heading}>Log in Form</h1>
          <div className={styles.form_container}>
            <div className={styles.right}>
              <button className={styles.google_btn} onClick={() => googleAuth()}>
                <img src="./images/google.png" alt="google icon" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <>
      {user?.access_token && gotDetail === false ? (
        <form onSubmit={handleSubmit}>
        <h3>Please provide more details</h3>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" value={dob} onChange={(event) => setDOB(event.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Enter your gender:</label>
          <input type="text" id="gender" value={gender} onChange={(event) => setGender(event.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="aboutme">About Me:</label>
          <textarea id="aboutme" value={aboutme} onChange={(event) => setaboutMe(event.target.value)} className="form-control" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
       ): 	gotDetail===true?	navigate("/data/profile"): <div> </div>
      
 	}</>
 		</div>
 	);
 }



export default Login;