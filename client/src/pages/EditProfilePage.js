import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const EditProfilePage = () => {
  const [form, setForm] = useState({
    fullname: "",
    image: "",
  });
  const [errorEdit, setErrorEdit] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await axios({
        method: "GET",
        url: `http://localhost:3000/api/users/getid`,
        params: {
          token: localStorage.getItem('token_login')
        }
      });

      console.log('data', response.data);

      const result = await axios({
        method: "PUT",
        url: `http://localhost:3000/api/users/updateprof/${response.data.id}`,
        data: {
          fullname: form.fullname,
          image: form.image,
        },
      });

      console.log(result);

      return <Navigate to="/" replace={true} />
    } catch (error) {
      console.log(error);
      setErrorEdit('Gagal perbaharui profil.');
    }
  };

  return (
    <div>
      <div>Edit Profile</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="fullname">
            Full Name
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="form-control"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="image">
            Image
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="form-control"
            />
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-success">
            Edit
          </button>
        </div>
      </form>

      {errorEdit && <p>{errorEdit}</p>}
    </div>
  );
};

export default EditProfilePage;