import { Avatar, Typography, Box, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

const People = ({ conversation, person, active, onClick }) => {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    if (!conversation || !person) return;
    const friendId = conversation.members.find(m => m !== person._id);
    const fetchFriend = async () => {
      try {
        const res = await api.get(`/userFor/${friendId}`, {
          headers: { "x-auth-token": localStorage.getItem("token") }
        });
        setFriend(res.data.user);
      } catch (err) { console.log(err); }
    };
    fetchFriend();
  }, [conversation, person]);

  if (!friend) return null;

  return (
    <Box onClick={onClick} sx={{
      display: "flex",
      gap: 2,
      alignItems: "center",
      borderRadius: 2,
      cursor: "pointer",
      transition: "0.2s",
      backgroundColor: active ? "rgba(34,197,94,0.2)" : "transparent",
      transform: active ? "scale(1.01)" : "scale(1)",
      "&:hover": { backgroundColor: "rgba(34,197,94,0.1)" },
      marginBottom: "0.3rem",
      width: "100%",
      padding: "0.8rem 0.5rem",
    }}>
      <Badge
        color="error"
        badgeContent={conversation.unreadCount || 0}
        invisible={!conversation.unreadCount}
        overlap="circular"
      >
        <Avatar
          src={friend.imgProfile ? friend.imgProfile : undefined}
          sx={{ width: 45, height: 45 }}
        >
          {!friend.imgProfile && friend.name?.slice(0, 1).toUpperCase()}
        </Avatar>
      </Badge>
      <Typography sx={{ fontWeight: active ? 600 : 500 }}>{friend.name}</Typography>
    </Box>
  );
};

export default People;
