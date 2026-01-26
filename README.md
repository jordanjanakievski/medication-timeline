# Medical Timeline

## Tech-Stack

- **Frontend:** React, TypeScript, Material UI
- **Backend:** Python, Django
- **Database:** PostgreSQL (NeonDB)
- **Infrastructure:** Docker

## Description

This project visualizes a patient's prescription medical history in a timeline and tableformat.

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/jordanjanakievski/medication-timeline.git
```

2. Navigate to the project directory:

```bash
cd medication-timeline
```

3. Build and run the Docker containers:

```bash
docker-compose up --build
```

## Deployment

**Backend:** Deployed on [Render.com](https://medication-timeline-hklh.onrender.com)

**Frontend:** Deployed on [Vercel](https://medication-timeline-kappa.vercel.app/)

Upon loading the page, it may take a few moments for the backend to spin up if it has been idle.

This endpoint can be used to view all the patient ids available in the database:

[https://medication-timeline-hklh.onrender.com/api/patient/](https://medication-timeline-hklh.onrender.com/api/patient/)

## Thoughts and Considerations

### Data

- Only one DB table is used to store all prescription data
  - UUID is used as the primary key for each medication entry
  - Patient ID is used to associate medications with specific patients
    - In practice we could use this to link to a patients table
  - Group ID is used to group related medications together under the same patient

### Timeline vs Table

- Timeline allows for better visualization of medication history over time
- Easy to see gaps
- Table provides a more traditional view
- Easy to see all medications, especially if data is incomplete in any way that would complicate timeline creation

### Future Improvements

- For this exercise, creating a more robust data model consisting of multiple tables could be beneficial
  - Patients table
  - Prescriptions table
  - Providers table
- Making the timeline more responsive and mobile-friendly
  - Attempted a few options, but nothing really worked well and was going to be really usable for a user
  - Would only really be able to show the table view on mobile similar to many other charting solutions medical professionals would be used to

## AI Assistance

CLI tools were used throughout to speed up development and generate boilerplate code. It helped me quickly test some timeline visualizations based on some samples found online.

Being new to Django, the tools helped me quickly scaffold up the backend and walk me through setting up models, serializers, and views. Theoretically, all of this was very similar to other MVC frameworks like Express.js or Spring Boot of which I have used before, but made iterating and implementing with Django much faster.
