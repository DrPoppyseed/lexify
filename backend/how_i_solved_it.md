# How I Solved It

This file contains problems I ran into during development, and how I solved them.

## Setting up integration tests

When building an app with Diesel/Rocket, I had a lot of trouble 1) setting up pooled connections to my Mysql database 2)
setting up integration tests for my API.

I briefly went over how I handled the first problem in
a [stackoverflow  answer](https://stackoverflow.com/a/73670460/11435461) I posted.

In order to accommodate for easier testing, I opted to implement pooling without help from the `rocket_sync_db_pool`
crate.
Instead, I opted for a solution that was implemented with `r2d2` directly, and sticking that into the server state.

By creating a portable `rocket_launch` function, I was able to use the same code for my `main` function in my app, and
for my `setup` function in my `tests` directory. I had it so that the function built the server, and actually launched
it.
However, after running my tests a number of times, I observed that the rocket instance only launched after I tried to
quit the server.
The rocket instance would simply hang until I did something.

I tried many solutions posted online, but the best answer I got was from the official documentation (duh), where it goes
over
[asynchronous testing](https://rocket.rs/v0.5-rc/guide/testing/#asynchronous-testing) with accommodating code as
examples. 
