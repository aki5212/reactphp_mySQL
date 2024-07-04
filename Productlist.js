import axios from "axios";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";


function Productlist()
{ 
    const [userData, setUserData]= useState([]);
    const [message, setMessage]= useState('');
    const [formData, setFormData] = useState({ pday: '', ptitle: '', pprice: '', pfile: null, pstatus: '' });
   
    useEffect( ()=>{   
    getUserData();
    },[]);

    const getUserData = async () => {
        try {
            console.log('Fetching user data...');
            const reqData = await fetch("http://localhost/phpcrud/api/product.php");
            if (!reqData.ok) {
                throw new Error(`HTTP error! status: ${reqData.status}`);
            }
            const resData = await reqData.json();
            console.log('User data fetched:', resData);
            setUserData(resData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage('Error fetching user data');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete("http://localhost/phpcrud/api/product.php/" + id);
            console.log('Delete response:', res.data);
            setMessage(res.data.success);
            getUserData();   
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Error deleting user');
        }
    };

    const handleChange = (e) => {
        console.log('Input change:', e.target.name, e.target.value);
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {e.preventDefault();
        try {
            console.log('Submitting form data:', formData);
            const response = await axios.post('http://localhost/phpcrud/api/product.php', formData);
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
            <div className="container container_overflow">
                <div className="row">
                    <div className="col-md-10 mt-4">
                        <h5 className="mb-4">求人リスト</h5> 
                        <p className="text-danger"> </p>                 
                                <table className="table table-bordered">
                                <thead>
                                <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">日　　付</th>
                                <th scope="col">タイトル</th>
                                <th scope="col">料　　金</th>
                                <th scope="col">イメージ図</th>
                                <th scope="col">ステータス</th>
                                <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        userData.map((pdata, index)=>(
                                            <tr key={index}>
                                            <td>{index+1 } </td>
                                            <td>{pdata.pday } </td>
                                            <td>{pdata.ptitle } </td>
                                            <td>{pdata.pprice } </td>
                                            <td><img src={`http://localhost/phpcrud/images/${pdata.pimage}`} height={50} width={90} alt="Product"/></td>
                                            <td>{ pdata.status==1?"求人中":"完　了"} </td>
                                            <td>
                                                <Link to={`/editproduct/${pdata.id}`} className="btn btn-success mx-2">Edit</Link>
                                                <button className="btn btn-danger" onClick={() => handleDelete(pdata.id)}>Delete</button>
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
export default Productlist;