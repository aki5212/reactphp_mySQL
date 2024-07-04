import axios from "axios";
import React, {useState, useEffect }from "react";
import { useNavigate, useParams } from "react-router-dom";

function Edituser()
{   
    const navigate= useNavigate();  
    const {id}=   useParams();
    const [formvalue, setFormvalue]= useState({username:'', usermail:'', status:''});
    const [message, setMessage]= useState('');

    const handleInput =(e)=>{
        setFormvalue({...formvalue, [e.target.name]:e.target.value});
    }

    useEffect( ()=>{
        const userRowdata= async()=>{
         const getUserdata= await fetch("http://localhost/phpcrud/api/user.php/"+id);
         const resuserdata= await getUserdata.json();        
         setFormvalue(resuserdata);
        }
        userRowdata();
    },[]);

    const handleSubmit =async(e)=>{
         e.preventDefault();
         //console.log(formvalue);
         const formData= {id:id,username:formvalue.username, usermail:formvalue.usermail, status:formvalue.status}; 
         const res= await axios.put("http://localhost/phpcrud/api/user.php",formData);
         //let jsonres= res.data.json();        
           if(res.data.success)
           {
            setMessage(res.data.success);
            setTimeout( ()=>{               
                navigate('/userlist');
            }, 2000);
           
           }
        }   
    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-4">
                        <h5 className="mb-4">求職者修正</h5> 
                        <p className="text-sucess"> { message }</p>                 
                         <form onSubmit={ handleSubmit}>
                            <div className="mb-3 row">
                            <label className="col-sm-2">名前</label>
                            <div className="col-sm-10">
                            <input type="text" name="username" value={formvalue.username} className="form-control" onChange={ handleInput}/>
                            </div>
                            </div>
                            <div className="mb-3 row">
                            <label  className="col-sm-2">メールアドレス</label>
                            <div className="col-sm-10">
                            <input type="text" name="usermail" value={formvalue.usermail} className="form-control" onChange={ handleInput}/>
                            </div>
                            </div>

                            <div className="mb-3 row">
                            <label className="col-sm-2">ステータス</label>
                            <div className="col-sm-10">
                            <select name="status" className="form-control" value={formvalue.status} onChange={ handleInput}>
                                <option value="">--Select Status--</option>
                                <option value="1">稼働中</option>
                                <option value="0">非稼働</option>
                            </select>
                            </div>
                            </div>

                            <div className="mb-3 row">
                            <label className="col-sm-2"></label>
                            <div className="col-sm-10">
                           <button  name="submit" className="btn btn-success">修正</button>
                            </div>
                            </div>

                         </form>
      
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Edituser;