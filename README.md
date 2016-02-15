# Node-Penny-Auctions
Flexible, real-time penny auction site built on NodeJS.

## Before you continue reading
This is a work in progress and in no way to be considered anything even near production-ready. Strings in the front-end
are hard-coded german for now and any pieces are missing, so be ready to face errors, exceptions and staircases leading 
to nowhere.

## Requirements
- NodeJS
- MongoDB as the DB server
- Nginx or Apache as a proxy (will do without, too)

## Installation
Make sure MongoDB is ready and available. Before anything, run `npm install`. Next, you should take a look at 
config.json` and adjust everything to fit your needs. There are some undocumented parameters, but nothing you should
need for now.

#### Running as a service
To run the site as a service on any modern Linux, just use systemd scripts like the one below:

    [Unit]
    Description=Service name
    After=network.target
    
    [Service]
    Type=simple
    ExecStart=/path/to/bin/www
    Restart=always
    User=username
    Group=usergroup
    WorkingDirectory=/path/to/project/root
    PIDFile=/path/to/project/root/pidfile
    
    [Install]
    WantedBy=multi-user.target
    
Put it in `etc/systemd/system/service-name.service`, run `sudo systemctl daemon-reload` and you should be good to go.
