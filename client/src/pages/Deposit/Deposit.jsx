import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';

const Deposit = () => {
  const [formData, setFormData] = useState({
    accountType: '',
    name: '',
    address: '',
    mobile: '',
    amountWords: '',
    denominations: {
      '2000': '',
      '500': '',
      '200': '',
      '100': '',
      '50': '',
      '20': '',
      '10': '',
      '5': '',
      coins: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Object.keys(formData.denominations).includes(name)) {
      setFormData({
        ...formData,
        denominations: {
          ...formData.denominations,
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="dashboard-wrapper px-4 py-4 theme-bg mt-3">
      <div className="row">
        <div className="col-md-8">
<div className="card theme-card border-0 shadow p-3"> 

          <h4 className="mb-3 theme-text">Deposit Form</h4>
          <form>
              <div className="mb-2">
                <label className='form-label text-black'>
                  खाता प्रकार / खाता संख्या (Account Type / Account Number)
                </label>
                <input type="text" className="form-control" name="accountType" value={formData.accountType} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className='form-label text-black'>नाम (Name)</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className='form-label text-black'>पता (Address)</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className='form-label text-black'>मोबाइल नं. (Mobile Number)</label>
                <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className='form-label text-black'>राशि शब्दों में (Amount in Words)</label>
                <input type="text" className="form-control" name="amountWords" value={formData.amountWords} onChange={handleChange} />
              </div>

              <h5 className="mt-4">नकद/चेक विवरण (Cash/Cheque Details)</h5>
              {['2000', '500', '200', '100', '50', '20', '10', '5', 'coins'].map(denom => (
                <div className="mb-2 row" key={denom}>
                  <label className="col-md-2 col-form-label text-black">
                    {denom === 'coins' ? 'सिक्के (Coins)' : `${denom}x`}
                  </label>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      name={denom}
                      value={formData.denominations[denom]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}

              <button type="submit" className="btn btn-primary mt-3">Submit (जमा करें)</button>
            </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Deposit;
