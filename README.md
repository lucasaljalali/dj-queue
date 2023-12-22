# DJ QUEUE

#### Video Demo: https://youtu.be/BC-5Gu88Tv4

#### App URL: https://dj-queue.vercel.app/

#### Description:

DJ QUEUE is an innovative application developed to empower DJs in managing music requests and enhancing the guest experience at parties and events.
The inspiration behind this project originated from a conversation with a professional DJ during a wedding event.
The DJ expressed the challenges faced in handling music requests, often disrupting the flow of the event.
DJ QUEUE addresses these challenges by enabling guests to interactively vote for their preferred tracks from a curated list, eliminating the need for constant requests and allowing DJs to focus on delivering an uninterrupted music experience.

### Technology Stack:

DJ QUEUE is crafted using TypeScript and React, utilizing NEXT JS for optimized performance.
The backend leverages Google Firestore as the database, ensuring efficient data retrieval through optimized queries, pagination, and ordered results.
The app's architecture is designed to maintain real-time updates and seamless user interactions.

### Features:

#### User Authentication:

DJ QUEUE offers a secure login system, allowing DJs to create accounts using email/password or Google authentication.
The platform facilitates password resets for user convenience, ensuring a smooth login experience.

#### Tab Structure:

1. **Ranking Tab:**
   The heart of the application, displaying a live-updating table of voted tracks.
   DJs can monitor real-time votes without manual refresh, ensuring a dynamic music selection process.

2. **My Musics Tab:**
   Provides DJs with a comprehensive view of their music library.
   This section allows DJs to add new tracks with details like title, genre, and duration via a user-friendly form.
   Additionally, DJs can generate a unique QRCode and link for guest access to the music list, ensuring easy retrieval without repeated queries.

3. **My User Tab:**
   Enables DJs to personalize their displayed name, profile image, and request password resets for account security.

#### Guest Interaction:

Guests are empowered to access the DJ's music list effortlessly by reading the DJ's QRCode or link.
Without requiring account creation, guests can simply 'like' their preferred tracks, storing their votes in browser cookies.
This frictionless interaction ensures guest engagement without unnecessary complexities, enhancing the party experience.

DJ QUEUE aims to provide DJs with a streamlined tool for managing music selections while engaging guests actively in the process.
The application's intuitive design and efficient functionalities create an atmosphere where DJs can focus on delivering an exceptional music experience while guests actively contribute to the playlist selection.
