To run the backend, download and install:
  -Docker Desktop

During Development:
  The codebase is structured into business_logic\app\... which contains logic files, routers and a main.py file that runs the routers (found within routers)
  Files within e.g. business_logic\app\pathfinder contains the logic required for the routing algorithm
  Routers such as routing.py contains the fastAPI routers whci hare used to provide json output back to the frontend or whatever created the connection
  Main.py opens up localhost port 8000 for any requests and puts together all the routers so that they work together as intended.

  For more details, look at Josh's code routers/routing.py, app/pathfinder

Testing:
  Before trying to run the container, Ensure Docker Desktop is running
  Then run:
    docker compose up --build      (builds the container and opens the localhost port which can be communicated with)
    then communicate with container via:
    curl http://localhost:8000/health       (health check and makes sure it works) or otherwise:
    open your browser and http://localhost:8000/docs        (for a more interactive interface)
