# Medical Timeline

## Tech-Stack

- **Frontend:** React, TypeScript, Material UI
- **Backend:** Python, Django
- **Database:** PostgreSQL (NeonDB)
- **Infrastructure:** Docker

## Description

This project visualizes a patient's prescription medical history in a timeline format.

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
