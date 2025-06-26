import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase' // adjust path if needed
import '../styles/More.css'
export default function More() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);


  return (
    <div className="more">
      <h1>More Links</h1>
          
          
      <div className='more-links'>
      <a href="/Freescreen"><button>Freescreen</button></a> 
      <a href="/PastEvents" ><button>Past Events</button></a>
      <a href="/CurrentBoard" ><button>Current Board</button></a> 
      <a href="/Hypnos" ><button>Café</button></a>
      <a href="https://hypnostheatre.com/" target="_blank" ><button>Hypnos</button></a> 
      <a href="/Volunteering" ><button>Volunteering</button></a>
      </div>
      


            {/* <a href="/Press" className="morebuttons">Press</a>  */}
            {/* <a href="/AnnualMeeting" className="morebuttons">Annual Meeting</a> < br /> */}
            {/* <a href="/CurrentPastProjects" className="morebuttons">Current & Past Projects</a>  */}
           

            

            <div className='newsletter-area'>
              <h2> Newsletter</h2>
            <form className="newsletter">
            <input type="text" className='newsletter-email' placeholder="Email" /><button className= 'signUp-btn' type="submit" >Sign up</button><br/>
            </form>
            </div>
            
            {/* <p> logo folder</p> <br /> */}

            {/* <a href="/MemberInfo">Member Info</a> <br />
            <a href="/SinglePage">Single Page</a> */}

            {user && (
            <button onClick={() => navigate('/upload-private-media')} style={{ marginBottom: 12 }}>
            Upload Files to Private-Media
            </button>
            )}
    </div>
  )
}
