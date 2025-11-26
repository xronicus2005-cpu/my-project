import { Avatar, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

const People = ({conversation, person, active, onClick }) => {
  const [user, setUser] = useState()

  useEffect(() => {
    if (!person || !conversation) return;
    const friend = conversation.members.find(m => m !== person._id)
    const fetchFriend = async() => {
      try{
        const dataFriend = await api.get(`/friend/${friend}`, {headers: {"x-auth-token": localStorage.getItem("token")}});
        setUser(dataFriend.data)
      } catch(err){ console.log(err) }
    }
    fetchFriend()
  }, [conversation, person])

  return (
    <Box 
      onClick={onClick}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.2s",
        backgroundColor: active ? "#81FBB8" : "transparent",
        transform: active ? "scale(1.005)" : "scale(1)",
        "&:hover": { backgroundColor: "#81FBB8" },
        marginBottom: "0.1rem",
        width: "100%",
        padding: "1rem 0.5rem",
      
      }}
    >
      <Avatar
        src={user?.friend?.imgProfile && `${import.meta.env.VITE_SERVER_URL}${user?.friend?.imgProfile}`}
        alt={user?.name}
        sx={{width: "40px", height: "40px"}}
      >
        {!user?.friend?.imgProfile && user?.friend.name?.slice(0, 1).toUpperCase()}
      </Avatar>

      <Typography>{user?.friend?.name}</Typography>
    </Box>
  )
}

export default People;