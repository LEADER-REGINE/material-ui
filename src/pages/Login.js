import React, { useState } from "react";
import firebase from "../utils/firebase";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { TextField, Button, Card, CardMedia, CardHeader, IconButton, Container, Grid, Typography, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";

import image3 from "../images/image3.png";
import { DeleteOutline } from "@material-ui/icons";

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



export default function Login() {



  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const signin = (e) => {
    if (!payload.email || !payload.password) {
      alert("Make sure all fields are filled");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          // Signed in
          // ...
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };



  const classes = useStyles()

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
            <img src={image3} alt="background" className="image3" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-form">
            <h1>Login</h1>

            <div id="taena">
              <TextField
                id="outlined-basic"
                type="text"
                label="Email"
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
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                onChange={userInput("password")}
                value={payload.password}
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <h6>Forgot password?</h6>
            </div>

            <div id="taena">
              <Button
                variant="contained"
                color="primary"
                onClick={signin}>
                Log In
              </Button>
            </div>

            <div id="taena">
              <a href="/register">
                <button className="reg-btn">Sign up</button>
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
