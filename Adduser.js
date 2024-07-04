import axios from 'axios';  //axiosをインポートする
import React, {useState } from "react";
import { useNavigate } from 'react-router-dom';

function Adduser()
{
    const navigate= useNavigate();  
    const [formvalue, setFormvalue]= useState({username:'', usermail:'', status:''});
    const [message, setMessage]= useState('');
    const [error, setError] = useState('');

    const handleInput =(e)=>{
        console.log('Input change:', e.target.name, e.target.value); // デバッグ用
        setFormvalue({...formvalue, [e.target.name]:e.target.value});
       
    };

    const handleSubmit =async(e)=>{
        e.preventDefault();
        setError('');
        console.log('Submitting form value:', formvalue); // デバッグ用
        // フォームの入力値を取得
        const formData= {username:formvalue.username, usermail:formvalue.usermail, status:formvalue.status}; 
        try {
            const res = await axios.post("http://localhost/phpcrud/api/user.php", formData);
            console.log('Server response:', res.data); // デバッグ用
            if (res.data.success) {
                setMessage(res.data.success);
                setTimeout(() => {
                    navigate('/Userlist');
                }, 2000);
            }else{
                setError(res.data.error || 'エラーが発生しました');
            }
        } catch (error) {
            // console.error('Error occurred:', error); // デバッグ用
            setError('エラーが発生しました!' +error.message);
        }
    };
    
    return(
        <React.Fragment>
             <div className="container">
                <div className="row">
                    <div className="col-md-6 text-start mt-4">
                      <h5>求職者登録</h5>
                      {message &&<p className="text-success"> { message }</p>}
                      {error &&<p className="text-danger"> { error }</p>}
                      <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                            <label htmlFor="username" className="col-sm-2">名前</label>
                            <div className="col-sm-10">
                            <input type="text" id="username" name="username" value={formvalue.username} className="form-control" onChange={ handleInput} autoComplete="username"/>
                            </div>
                            </div>
                            <div className="mb-3 row">
                            <label htmlFor="usermail"  className="col-sm-2">メールアドレス</label>
                            <div className="col-sm-10">
                            <input type="text" id="usermail" name="usermail" value={formvalue.email} className="form-control" onChange={ handleInput} autoComplete="email"/>
                            </div>
                            </div>
                            <div className="mb-3 row">
                            <label htmlFor="status" className="col-sm-2">ステータス</label>
                            <div className="col-sm-10">
                            <select id="status" name="status" className="form-control" value={formvalue.status} onChange={handleInput} autoComplete="off">                                <option value="">--Select Status--</option>
                                <option value="1">有効</option>
                                <option value="0">無効</option>
                            </select>
                            </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-sm-10 offset-sm-2">
                                <button name="submit" className="btn btn-success">登録</button>
                             </div>
                            </div>

                         </form>
      
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Adduser;