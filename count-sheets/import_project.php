<?php
$target_dir = "projects/";
$target_dir = $target_dir . basename( $_FILES["project"]["name"]);

if (move_uploaded_file($_FILES["project"]["tmp_name"], $target_dir)) {
    echo "The file ". basename( $_FILES["project"]["name"]). " has been uploaded.<br><br><form action=\"import_music.php\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"project\" value=\"".$target_dir."\"><input type=\"submit\" value=\"Upload a sound file\" name=\"submit\"></form><br><br><form action=\"counts.php\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"project\" value=\"".$target_dir."\"><input type=\"submit\" value=\"Start your project\" name=\"submit\"></form>";
} else {
    echo "Sorry, there was an error uploading your file.<br><br><a href=\"import_project.html\">Try a different file</a><br><br><a href=\"import_music.php\">Upload a sound file</a><br><br><a href=\"counts.php\">Start your project</a>";
}
?>