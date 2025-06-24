import React from 'react'
import '../styles/Freescreen.css';

export default function freescreen() {
  return (
    <div>
      <h1>Freescreen</h1>

      <div className="freescreen">
        <img src="https://filmimalmo.se/wp-content/uploads/2025/05/0521_Freescreen_program-cover.png" alt="freescreen" />
       
        <div className="text">
          <h2>THE ONE AND ONLY FREESCREEN! </h2>
          <p>FREESCREEN is an open screening of local short films – no curation, no criteria, < br />
            open to anyone based in the Malmö/Skåne area who’s made a film and wants it shown on the big screen < br />
            – amateur/student/pro: whoever you are – you’re welcome here! < br />
          </p>
           
          <p> Join us and discover Malmö’s local talent with an evening of eclectic free-for-all short film programming, < br />
           meet other filmmakers and who knows, maybe you’ll meet your next collaborator over a box of popcorn!
          </p>
            
          <p>Event:  Wednesday, May 21  Hypnos Theatre < br />
            Doors open 18:00 – Doors close 18:30< br />
            Film i Malmö Membership is NOT REQUIRED to attend or submit.< br />
            Seating is first come first serve. < br />
            Please notify us of any accessibility needs. < br />
            While FREESCREEN is an uncurated open screen, < br />
            we reserve the right to disqualify films that are explicitly < br />
            racist/sexist/homophobic/xenophobic or any form of hate speech.< br />
            Film i Malmö Freescreen is made by us all with support from Malmö Stad.< br /></p>

            <p> <strong>HAVE YOU MADE A FILM?</strong> < br />
            Let’s watch it at Hypnos Theatre!
          </p>

          <p><strong>ENTRY DEADLINE:</strong>  Monday, May 19 22:00  < br />
            Max runtime: 20min < br />
            File format: MP4< br />
            Submission method: WeTransfer (Paste your link in form below)< br />
            Get to work and we’ll see you at the show!< br />
          

          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeWGPMv2X94avBlwPTjakqT3KX8hiKtcQMzgHKMy3tikh8hLw/viewform" 
            className="freescreenform" target="_blank">Fill in the form here to submit your film!</a> 
          </p>

        </div>
      </div>
    </div>

   
  )
}
