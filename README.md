# Bookdbtastic
 
This repo is a fork of [bookdbtastic](https://github.com/compose-ex/bookdbtastic/) with lots of changes. What I've done is:

* added docker-compose for all components (book app, mongo, elk stack)
* all dependencies updated (including mongoosastic)
* added more mapped fields to the book model
* added scripts for bulk load/indexing of books ( both CLI and server routes)
* separated code in smaller modules to improve readability

## Requirements

 * installed [docker](https://docs.docker.com/installation/)
 * installed [docker-compose](https://docs.docker.com/compose/install/)

## usage

    git clone https://github.com/guumaster/bookdbtastic.git
    cd bookdbtastic
    docker-compose up -d

Then open `http://localhost:3000/` to see the app, or `http://localhost:8080/` to interact with Kibana.


## TODO

* improve logging on loader/indexer routes
* link pagination on searches
* create a kibana4 dashboard
* try to embed kibana4 charts on express server
