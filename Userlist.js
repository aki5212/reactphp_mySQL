import axios from "axios";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";


function Userlist()
{ 
    const [userData, setUserData]= useState([]);
    const [message, setMessage]= useState('');
    const [formData, setFormData] = useState({username: '',usermail: '',status: ''});
   
    useEffect( ()=>{   
    getUserData();
    },[]);

    const getUserData = async () => {
        try {
            const reqData = await fetch("http://localhost/phpcrud/api/user.php");
            if (!reqData.ok) {
                throw new Error(`HTTP error! status: ${reqData.status}`);
            }
            const resData = await reqData.json();
            setUserData(resData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete("http://localhost/phpcrud/api/user.php/" + id);
            setMessage(res.data.success);
            getUserData();   
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Error deleting user');
        }
    };

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {e.preventDefault();
        try {
            const response = await axios.post('http://localhost/phpcrud/api/user.php', formData);
            console.log(response.data);
            setMessage('User added successfully');
            getUserData();
        } catch (error) {
            console.error('Error adding user:', error);
            setMessage('Error adding user');
        }
    };

       return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-10 mt-4">
                        <h5 className="mb-4">求職リスト</h5> 
                        <p className="text-danger">{ message} </p>
                             <table className="table table-bordered">
                                <thead>
                                <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">名前</th>
                                <th scope="col">メールアドレス</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                 userData.map((uData, index)=>(
                                  <tr key={index}>
                                <td>{index+1 }</td>
                                <td>{uData.username}</td>
                                <td>{uData.usermail}</td>
                                <td>{uData.status==1 ? "稼働中":"非稼働"} </td>
                                <td>
                                 <Link to={"/edituser/"+uData.id} className="btn btn-success mx-2">Edit</Link>
                                 <button className="btn btn-danger" onClick={ ()=>handleDelete(uData.id)}>Delete</button>
                                </td>
                                </tr>
                                ))
                                }                                
                                </tbody>
                                </table>  
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Userlist;