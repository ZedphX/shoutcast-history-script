<?php

###############################################
# Returns the html of the shoutcast website.  #
# Made in php mainly to avoid CORS.           #
###############################################

$data = json_decode(file_get_contents("php://input"));

$songsHtml = file_get_contents($data->url);

echo $songsHtml;

die();
