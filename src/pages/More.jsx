import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase' // adjust path if needed
import '../styles/More.css';
export default function More() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);


  return (
    <div className="more">
      <h1>More Links</h1>
          
<<<<<<< HEAD
            <a href="/Press">Press</a> < br />
            <a href="/Freescreen">Freescreen</a> < br />
            <a href="/AnnualMeeting">Annual Meeting</a> < br />
            <a href="/CurrentBoard">Current Board</a> < br />
            <a href="/Hypnos">Cafe </a> < br />
            <a href="https://hypnostheatre.com/" target="_blank">Hypnos </a> < br />
            <a href="/pastevents">Past Events</a> < br />
            <a href="/CurrentPastProjects">Current & Past Projects</a> < br />
            <a href="/Volunteering">Volunteering</a>
=======
          
      
      <a href="/Freescreen"><button>Freescreen</button></a> 
      <a href="/PastEvents" ><button>Past Events</button></a> < br />
      <a href="/CurrentBoard" ><button>Current Board</button></a> 
      <a href="/Hypnos" ><button>Café</button></a> < br />
      <a href="https://hypnostheatre.com/" target="_blank" ><button>Hypnos</button></a> 
      <a href="/Volunteering" ><button>Volunteering</button></a>


            {/* <a href="/Press" className="morebuttons">Press</a>  */}
            {/* <a href="/AnnualMeeting" className="morebuttons">Annual Meeting</a> < br /> */}
            {/* <a href="/CurrentPastProjects" className="morebuttons">Current & Past Projects</a>  */}
           
>>>>>>> feature-tina

            <hr/>

            <h2> Newsletter</h2>
            <form className="newsletter">
            <input type="text" placeholder="Email" /><button type="submit" >Sign up</button><br/>
            </form>
            
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
