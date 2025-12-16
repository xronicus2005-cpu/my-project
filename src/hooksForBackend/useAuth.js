import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/me") // cookie avtomatik yuboriladi
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout"); // cookie o‘chiriladi
      setUser(null);
      toast.info(
        "Profildan Shiqtiniz!"
      );
    } catch {
      toast.error("Profildan shigiwda qatelik");
    }
  };

  return { user, loading, logout };
};
