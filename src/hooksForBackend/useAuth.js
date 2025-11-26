import { useEffect, useState } from "react";
import { api } from "../api/axios";

import { toast } from "react-toastify";

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
      const token = localStorage.getItem("token")
    
      if(!token){
        setLoading(false)
        return
      }

      api.get("/me", {
        headers: {"x-auth-token": token}
      }).then(res => {
        setUser(res.data)
      }).catch(err => {
        localStorage.removeItem("token")
      }).finally(() => {
        setLoading(false)
      })
    }, [])

    const logout = () => {
      localStorage.removeItem("token")
      setUser(null)
      toast.info("Profildan shiqtiniz sayttan jane dawamli paydalaniwdi qaleseniz profilinizge kirin")
      window.location.reload();
    }



    return {user, loading, logout}
}