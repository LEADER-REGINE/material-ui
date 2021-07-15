import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { TextField, Button, Card, CardMedia, CardHeader, IconButton, Container, Grid, Typography, CardContent } from "@material-ui/core";
import firebase from "../utils/firebase";

import image3 from "../images/image3.png";

import "../components/css/Login.css";

const useStyles = makeStyles({

  loginContainer: {
    width: 400
  },


  field: {
    marginTop: 20,

    display: "block"
  },

  loginContainer: {
    display: "flex",
    flexDirection: "row"
  },

  leftImage: {
    padding: 40,
    width: 500
  }
})







export default function Register() {
  const [payload, setPayload] = useState({
    fname: "",
    lname: "",
    email: "",
    gender: "",
    password: "",
    confirmpassword: "",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZNvTWjTSpH6CCYzLPxYkagOsGEZSrk5GMw&usqp=CAU",
  });

  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const db = firebase.firestore(); // eslint-disable-next-line
  const history = useHistory();
  const register = (e) => {
    if (payload.password !== payload.confirmpassword) {
      alert("Passwords doesn't match! Please try again");
    } else if (
      !payload.password ||
      !payload.email ||
      !payload.gender ||
      !payload.lname ||
      !payload.fname
    ) {
      alert("Please fill out all of the fields");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          var user = userCredential.user;
          db.collection("users")
            .doc(user.uid)
            .set({
              fname: payload.fname,
              lname: payload.lname,
              gender: payload.gender,
              uid: user.uid,
              profilePic: payload.profilePic,
            })
            .then((docRef) => {})
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };

  return (

    // <Container>
    //   <Grid Container>
    //     <Card className={classes.loginContainer}>
    //       <CardMedia className={classes.leftImage} md={12}> 

    //         <img src={image3} alt="background" className="image3" />
    //       </CardMedia>




    //       <CardContent md={12}>
    //         <Typography
    //           variant="h5"
    //           align="center">
    //           Log In
    //         </Typography>
    //         <form>
    //           <TextField
    //             className={classes.field}
    //             id="outlined-basic"
    //             type="text"
    //             label="Email"
    //             name="email"
    //             onChange={userInput("email")}
    //             value={payload.email}
    //             variant="outlined"
    //             fullWidth
    //             required
    //           />
    //           <TextField
    //             className={classes.field}
    //             id="outlined-basic"
    //             label="Password"
    //             variant="outlined"
    //             type="password"
    //             name="password"
    //             onChange={userInput("password")}
    //             value={payload.password}
    //             fullWidth
    //             required

    //           />

    //           <Button
    //             className={classes.field}
    //             variant="contained"
    //             color="primary"
    //             onClick={signin}
    //             fullWidth
    //             required
    //           >
    //             Log In
    //           </Button>

    //           <Button
    //             className={classes.field}
    //             variant="contained"
    //             color="primary"
    //             onClick={signin}
    //             component={Link}
    //             to="/register"
    //             fullWidth
    //             required
    //             align="center"
    //           >
    //             Register
    //           </Button>
    //         </form>

    //       </CardContent>
    //     </Card>
    //   </Grid>
    // </Container>




    <div className="login-container">
      <div className="login-item">
        <div className="login-left">
          <div className="image3-container">
            <img src={image3} alt="" className="image3" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-form" noValidate autoComplete="off">
            <h1>Register</h1>
            <div className="login-name">
              <div id="fname">
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  type="text"
                  name="fname"
                  onChange={userInput("fname")}
                  value={payload.fname}
                  style={{ width: "100%" }}
                />
              </div>

              <div id="lname">
                <TextField
                  id="outlined-basic"
                  type="text"
                  label="Last Name"
                  name="lname"
                  onChange={userInput("lname")}
                  value={payload.lname}
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div id="taena">
              <p className="login-p">Gender</p>
              <div
                onChange={userInput("gender")}
                value={payload.gender}
                id="radio-container"
              >
                <div>
                  <input type="radio" value="Male" name="gender" /> Male
                </div>
                <div>
                  <input type="radio" value="Female" name="gender" /> Female
                </div>
                <div>
                  <input type="radio" value="Other" name="gender" /> Other
                </div>
              </div>
            </div>
            <div id="taena">
              <TextField
                id="outlined-basic"
                type="text"
                label="E-mail"
                name="email"
                onChange={userInput("email")}
                value={payload.email}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <TextField
                id="outlined-basic"
                type="password"
                label="Password"
                name="password"
                onChange={userInput("password")}
                value={payload.password}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <TextField
                type="password"
                label="Confirm Password"
                name="confirmpassword"
                onChange={userInput("confirmpassword")}
                value={payload.confirmpassword}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <button onClick={register} className="reg-btn">
                Register
              </button>
            </div>
            <div id="taena-alr">
              <div>
                <p className="login-p">Already have an account? </p>

                <Link to="/login" className="btn btn-primary">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
