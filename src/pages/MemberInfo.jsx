import React from 'react'
import '../styles/MemberInfo.css';

export default function memberinfo() {
  return (
    <div> <h1>Member info</h1>

    <p>Name:</p>
    <p>Birthdate:</p>
    <p>Email:</p>
    <p>Address:</p>
    <p>Valid through:</p>
    <p>Payment date:</p>
    
    <hr/>
    
      <div className="checkboxes">

        <h3>Renew membership:</h3>
        <label class="container"> 
          <input type="radio"/>
          <span class="checkmark"></span>
          100kr/2 months
        </label> 
        
        < br/>

        <label class="container">
          <input type="radio"/>
          <span class="checkmark"></span>
          500kr/1 year
        </label>

        < br/>
        <button class="button" type="submit">Checkout</button>

      </div>
    </div>
    
  )
}
