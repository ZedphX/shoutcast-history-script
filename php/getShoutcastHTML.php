<?php

###############################################
# Returns the html of the shoutcast website.  #
# Made in php mainly to avoid CORS.           #
###############################################

$shoutcastUrl = $_POST['url'];

$songsHtml = file_get_contents($shoutcastUrl);

echo $songsHtml;

die();
