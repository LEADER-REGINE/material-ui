import { Avatar, Card, CardContent, CardHeader, CardMedia, CardActions, Collapse, IconButton, makeStyles, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx';
import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";

export default function Post({ states }) {

    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    var UID = user.uid;

    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
    }));

    const [isClick, setClick] = useState(false);

    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const heartPost = (docId) => {
        var postsRef = db.collection("posts").doc(docId);
        let date = new Date();
        let likedDate = date.toLocaleString();
        userRef.get().then((doc) => {
          let user = doc.data().fname + " " + doc.data().lname;
    
          postsRef
            .collection("hearts")
            .doc(UID)
            .get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                postsRef
                  .collection("hearts")
                  .doc(UID)
                  .delete()
                  .then(() => {
                    postsRef.get().then((doc) => {
                      let heartcount = doc.data().heartCtr;
                      var newheart = heartcount - 1;
                      batch.set(
                        postsRef,
                        {
                          heartCtr: newheart,
                        },
                        { merge: true }
                      );
                      batch.commit().then(() => { });
                    });
                  });
              } else {
                postsRef
                  .collection("hearts")
                  .doc(UID)
                  .set({
                    value: user + " likes this post!",
                    likedTime: likedDate,
                    createdAt: timestamp(),
                  })
                  .then(() => {
                    postsRef.get().then((doc) => {
                      let useruid = doc.data().userID;
                      notifRef
                        .doc(useruid)
                        .collection("notifs")
                        .doc()
                        .set({
                          value: user + " loves your post!",
                          likedTime: likedDate,
                          createdAt: timestamp(),
                        })
                        .then(() => {
                          postsRef.get().then((doc) => {
                            let heartcount = doc.data().heartCtr;
                            var newheart = heartcount + 1;
                            batch.set(
                              postsRef,
                              {
                                heartCtr: newheart,
                              },
                              { merge: true }
                            );
                            batch.commit().then(() => { });
                          });
                        });
                    });
                  });
              }
            });
        });
      };

      var userRef = db.collection("users").doc(UID);




    return (
        <Card className={classes.root} elevation={2}>


            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar} src={states.profilePic} />
                        
                    
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={states.postAuthor}   //author 

                subheader={states.postedDate}  //date
            />

            <CardMedia
                className={classes.media}
                image={states.img_path}
                title="Paella dish"
            />


            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {states.postBody}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                {states.heartCtr}
                <IconButton aria-label="add to favorites"
                    value="Heart"
                    isclick={isClick}
                    onClick={() => {
                        heartPost(states.postID);
                        setClick(!isClick);
                    }}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>


            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>

                </CardContent>
            </Collapse>


        </Card>
    )
}
