#!/bin/bash 
/home/pi/stop.sh
amixer -c 0 -- sset Master 70%
/home/pi/start.sh

