<?php
$target_dir = "music/";
$target_dir = $target_dir . basename( $_FILES["music"]["name"]);

if (move_uploaded_file($_FILES["music"]["tmp_name"], $target_dir)) {
  if ($_POST["project"])
  {
    echo "The file ". basename( $_FILES["music"]["name"]). " has been uploaded.<br><br><form action=\"counts.php\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"project\" value=\"".$_POST["project"]."\"><input type=\"hidden\" name=\"music\" value=\"".$target_dir."\"><input type=\"submit\" value=\"Start your project\" name=\"submit\"></form>";
  }
  else
  {
    echo "The file ". basename( $_FILES["music"]["name"]). " has been uploaded.<br><br><form action=\"counts.php\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"music\" value=\"".$target_dir."\"><input type=\"submit\" value=\"Start your project\" name=\"submit\"></form>";
  }
} else {
  if ($_POST["project"])
  {
    echo "Sorry, there was an error uploading your file.<br><br><form action=\"counts.php\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"project\" value=\"".$_POST["project"]."\"><input type=\"submit\" value=\"Start your project\" name=\"submit\"></form>";
  }
  else
  {
    echo "Sorry, there was an error uploading your file.<br><br><a href=\"import_music.html\">Try a different file</a><br><br><a href=\"counts.html\">Start your project</a>";
  }
}
?>