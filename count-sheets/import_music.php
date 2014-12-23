<!DOCTYPE html>
<html>
  <body>
    <form action="import_music2.php" method="post" enctype="multipart/form-data">
      Upload a sound file?<br>
      <input type="file" name="music" id="music">
      <input type="hidden" name="project" value="<?php echo $_POST["project"]; ?>">
      <input type="submit" value="Upload" name="submit">
    </form>
    <br>
    <br>
    <br>
    <a href="counts.php">No</a>
  </body>
</html>