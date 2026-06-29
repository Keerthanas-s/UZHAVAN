import axiosConfig from "./axiosConfig";

const authApi = {

  register: (data) => {

    if (data.role === "FARMER") {
      return axiosConfig.post("/farmers/register", data);
    }

    return axiosConfig.post("/customers/register", data);

  },

  login: (data) => {

    // ADMIN LOGIN
    if (data.role === "ADMIN") {

      return axiosConfig.post(
        "/admin/login",
        {
          username: data.username,
          password: data.password
        }
      );

    }

    // FARMER LOGIN
    if (data.role === "FARMER") {

      return axiosConfig.post(
        "/farmers/login",
        {
          email: data.email,
          password: data.password
        }
      );

    }

    // BUYER LOGIN
    return axiosConfig.post(
      "/customers/login",
      {
        email: data.email,
        password: data.password
      }
    );

  }

};

export default authApi;