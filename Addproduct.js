import axios from 'axios';  //axiosをインポートする
import React, {useState } from "react";
import { useNavigate } from 'react-router-dom';

function Addproduct()
{  
    const navigate = useNavigate();
    const [formvalue, setFormvalue] = useState({ pday: '', ptitle: '', pprice: '', pfile: null, pstatus: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInput = (e) => {
        console.log('Input change:', e.target.name, e.target.value); // デバッグ用
        setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
    };

    const handleFileInput = (e) => {
        console.log('File input change:', e.target.files[0]); // デバッグ用
        setFormvalue({ ...formvalue, pfile: e.target.files[0] });
        
    };

    const handleSubmit =async(e)=>{
        e.preventDefault();
        setError('');
        console.log('Submitting form value:', formvalue); // デバッグ用
        // フォームの入力値を取得
        const formData = new FormData();
        formData.append('pday', formvalue.pday);
        formData.append('ptitle', formvalue.ptitle);
        formData.append('pprice', formvalue.pprice);
        formData.append('pfile', formvalue.pfile);
        formData.append('pstatus', formvalue.pstatus);

        try {
            const res = await axios.post("http://localhost/phpcrud/api/product.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Server response:', res.data); // デバッグ用
            if (res.data.success) {
                setMessage(res.data.success);
                setTimeout(() => {
                    navigate('/Productlist');
                }, 2000);
            } else {
                setError(res.data.error || 'エラーが発生しました');
            }
        } catch (error) {
            console.error('Error occurred:', error); // デバッグ用
            setError('エラーが発生しました!' + error.message);
        }
    };

    return(
    <React.Fragment>
        <div className="container">
            <div className="row">
              <div className="col-md-8 mt-4">
                <h5 className="mb-4">して欲しい(求人)登録</h5> 
                <p className="text-warning">{ message}</p>                              
                
                    <form onSubmit={ handleSubmit}>
                    <div className="mb-3 row">
                    <label  htmlFor="pday" className="col-sm-3">日　　付</label>
                    <div className="col-sm-9">
                    <input type="date" id="pday" name="pday" className="form-control" onChange={handleInput} />
                    </div>
                    </div>
                                 
                    <div className="mb-3 row">
                    <label htmlFor="ptitle" className="col-sm-3">タイトル</label>
                    <div className="col-sm-9">
                    <input type="text" id="ptitle" name="ptitle" className="form-control" onChange={handleInput} />
                    </div>
                    </div>

                    <div className="mb-3 row">
                    <label htmlFor="pprice" className="col-sm-3">料金</label>
                    <div className="col-sm-9">
                    <input type="number" id="pprice" name="pprice" className="form-control" onChange={handleInput} />
                    </div>
                    </div>

                    <div className="mb-3 row">
                    <label htmlFor="pday" className="col-sm-3">お願いしたい場所</label>
                    <div className="col-sm-9">
                    <input type="file" id="pfile" name="pfile" className="form-control" onChange={handleFileInput} />
                    </div>
                    </div>
                                <div className="mb-3 row">
                                <label htmlFor="status" className="col-sm-3">ステータス</label>
                                <div className="col-sm-9">
                                <select id="status" name="status" className="form-control" value={formvalue.status} onChange={handleInput} autoComplete="off">                                <option value="">--Select Status--</option>
                                <option value="1">有効</option>
                                <option value="0">無効</option>
                            </select>
                            </div>
                            </div>
                    <div className="mb-3 row">
                    <label htmlFor="pday" className="col-sm-3"></label>
                    <div className="col-sm-9">
                    <button type="submit" className="btn btn-success">登録</button>
                    </div>
                    </div>

                    </form>

             </div>
            </div>
        </div>
    </React.Fragment>
    );
}
export default Addproduct;