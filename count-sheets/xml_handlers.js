var new_upload = true;
var project;
var cycles;
var current_cycle_index = 1;
var current_count_index = 1;
var current_ripple_index = 1;

function changed()
{
  new_upload = true;
}

function reset(figure, playing_animation)
{
  current_cycle_index = 1;
  current_count_index = 1;
  var cycle = document.getElementById("cycle").value = cycles[current_cycle_index - 1].getAttribute("number");
  var counts = cycles[current_cycle_index - 1].getElementsByTagName("count");
  var count = document.getElementById("count").value = counts[current_count_index - 1].getAttribute("number");
  if (music_name)
  {
    document.getElementById("audio").pause();
    document.getElementById("audio").currentTime = 0;
  }

  playing_animation = false;
  figure = goToFrame(figure, cycle, count);
}

function importUserFiles()
{
  if (project_name)
  {
    importXML(project_name, fps);
  }
  
  if (music_name)
  {
    document.getElementById("music_section").innerHTML = "Current music file:<br><audio id=\"audio\" controls=\"true\"><source src=\"" + music_name + "\">Your browser does not support the audio element.</audio><br><br><p><button id=\"music\" onclick=\"toggleMusic()\">Toggle Music</button></p>"
  }
  
  return;
}

function importXML(filename,fps) {
  
  if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
  {
        xmlhttp=new XMLHttpRequest();
  }
  else // code for IE6, IE5
  {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp.open("GET",filename,false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  
  if (xmlDoc && new_upload)
  {
    project = xmlDoc;
    new_upload = false;
    document.getElementById("speed").value = project.getElementsByTagName("project")[0].getAttribute("speed");
    var cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");
    var counts = cycles[0].getElementsByTagName("count");
    var number = cycles[cycles.length - 1].getAttribute("number");
    var options = "";
    for (i = 1; i <= number; i++)
    {
      options += "<option>" + i + "</option>";
    }
    document.getElementById("cycle").innerHTML = options;
    document.getElementById("cycle").value = cycles[0].getAttribute("number");
    document.getElementById("count").value = counts[0].getAttribute("number");
  }
}

function importMusic() {
  document.getElementById("audio").src = document.getElementById("music").value;
}

function exportXML() {
  if (!project)
  {
    alert("No frames to save.");
  }
  else
  {
    var result = "";
    var indent_level = 0;
    
    result += "&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;<br>";
    
    var projects = project.getElementsByTagName("project");
    result += "&lt;project speed=\"" + document.getElementById("speed").value + "\"&gt;<br>"
    
    for (i = 0; i < projects.length; i++)
    {
      var cycles = projects[i].getElementsByTagName("cycle");
      indent_level++;
      
      for (j = 0; j < cycles.length; j++)
      {
        result += "&lt;cycle number=\"" + cycles[j].getAttribute("number")+ "\"&gt;<br>";
        
        var counts = cycles[j].getElementsByTagName("count");
        indent_level++;
        
        for (k = 0; k < counts.length; k++)
        {
          result += "&lt;count number=\"" + counts[k].getAttribute("number") + "\"&gt;<br>";
        
          var ripples = counts[k].getElementsByTagName("ripple");
          indent_level++;
          
          for (m = 0; m < ripples.length; m++)
          {
            result += "&lt;ripple number=\"" + ripples[m].getAttribute("number") + "\"&gt;<br>&lt;transform&gt;<br>" + ripples[m].getElementsByTagName("transform")[0].childNodes[0].data + "<br>&lt;/transform&gt;<br>&lt;/ripple&gt;<br>";
          }
          
          indent_level--;
          
          result += "&lt;/count&gt;<br>";
        }
        
        indent_level--;
        
        result += "&lt;/cycle&gt;<br>";
      }
    }
    
    result += "&lt;/project&gt;" + "<br>";
    
    
    document.write(result);
  }
  
  return;
}

function lastFrame(figure) {
  if (!project)
  {
    alert("No frames defined.");
    return figure;
  }
  
  cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");

  var counts = cycles[current_cycle_index - 1].getElementsByTagName("count");

  // if first in cycle
  if (current_count_index == 1)
  {
    if (current_cycle_index != 1)
    {
      current_cycle_index -= 1;
      counts = cycles[current_cycle_index - 1].getElementsByTagName("count");
      current_count_index = counts.length;
      document.getElementById("cycle").value = cycles[current_cycle_index - 1].getAttribute("number");
      document.getElementById("count").value = counts[current_count_index - 1].getAttribute("number");
    }
    else
    {
      alert("First frame reached.");
      return figure;
    }
  }
  else
  {
    current_count_index -= 1;
    document.getElementById("count").value = counts[current_count_index - 1].getAttribute("number");
  }
  
  var transform_str = counts[current_count_index - 1].getElementsByTagName("ripple")[current_ripple_index - 1].getElementsByTagName("transform")[0].childNodes[0].data;
  
  new_transforms = parseFigure(transform_str, figure.length);
  
  for (i = 0; i < figure.length; i++)
  {
    figure[i].transform = new_transforms[i];
  }
  
  return figure;
}

function nextFrame(figure, playing_animation) {
  if (!project)
  {
    alert("No frames defined.");
    if (playing_animation)
    {
      playing_animation = !playing_animation;
    }
    return [figure, playing_animation];
  }
  
  cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");

  var counts = cycles[current_cycle_index - 1].getElementsByTagName("count");

  // if last in cycle
  if (current_count_index == counts.length)
  {
    if (current_cycle_index != cycles.length)
    {
      current_cycle_index += 1;
      counts = cycles[current_cycle_index - 1].getElementsByTagName("count");
      current_count_index = 1;
    }
    else if (current_cycle_index == cycles.length)
    {
      if (playing_animation)
      {
        playing_animation = !playing_animation;
      }
      alert("Last frame reached.");
      return [figure, playing_animation];
    }
    
    document.getElementById("cycle").value = cycles[current_cycle_index - 1].getAttribute("number");
    document.getElementById("count").value = counts[0].getAttribute("number");
  }
  else
  {
    current_count_index += 1;
    document.getElementById("count").value = counts[current_count_index - 1].getAttribute("number");
  }
  
  var transform_str = counts[current_count_index - 1].getElementsByTagName("ripple")[current_ripple_index - 1].getElementsByTagName("transform")[0].childNodes[0].data;
  
  new_transforms = parseFigure(transform_str, figure.length);
  
  for (i = 0; i < figure.length; i++)
  {
    figure[i].transform = new_transforms[i];
  }
  
  return [figure, playing_animation];
}

function getFrame(figure)
{
  return goToFrame(figure, document.getElementById("cycle").value,  document.getElementById("count").value);
}

function goToFrame(figure, cycle, count)
{
  if (!project)
  {
    alert("No frames defined.");
    return figure;
  }
  
  var found = false;
  var cycle_index = 1;
  var count_index;
  var n = 0;
  
  cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");

  while (!found && (cycle_index <= cycles.length))
  {
    // match numbers
    if (cycles[cycle_index - 1].getAttribute("number") == cycle)
    {
      var counts = cycles[cycle_index - 1].getElementsByTagName("count");
      
      for (i = 1; i <= counts.length; i++)
      {
        if (counts[i - 1].getAttribute("number") == count)
        {
          found = true;
          count_index = i;
          break;
        }
      }
      
      if (!found)
      {
        break;
      }
    }
    else
    {
      cycle_index++;
    }
  }
  
  if (!found)
  {
    return figure;
  }
  
  // update indices
  current_cycle_index = cycle_index;
  current_count_index = count_index;
  
  var transform_str = counts[current_count_index - 1].getElementsByTagName("ripple")[current_ripple_index - 1].getElementsByTagName("transform")[0].childNodes[0].data;
  
  new_transforms = parseFigure(transform_str, figure.length);

  for (i = 0; i < figure.length; i++)
  {
    figure[i].transform = new_transforms[i];
  }

  return figure;
}

function parseFigure(transform_str, numNodes) {
  transforms = [];
  start_index = 0;
  transform_array = transform_str.split(",");
  
  for (i = 0; i < numNodes; i++)
  {
    transforms[i] = [];
  }
  
  for (i = 0; i < numNodes; i++)
  {
    str = [];
    for (j = 0; j < 16; j++)
    {
      str.push(parseFloat(transform_array[start_index + j]));
    }
    transforms[i] = mat4(str);
    start_index += 16;
  }
  
  return transforms;
}

function addFrame(figure) {
  if (confirm("Are you sure you want to add this frame?"))
  {
    var cycle_number = document.getElementById("cycle").value;
    var count_number = document.getElementById("count").value;
  
    var str = "";
    
    for (i = 0; i < figure.length; i++)
    {
      for (j = 0; j < 4; j++)
      {
        for (k = 0; k < 4; k++)
        {
          str += figure[i].transform[j][k] + ",";
        }
      }
    }
    
    // remove last comma
    str = str.substring(0, str.length - 1);
    
    // if no project
    if (!project)
    {
      project = document.implementation.createDocument(null, "project", null);
      var newXML = project.getElementsByTagName("project")[0];
      var cycle = project.createElement("cycle");
      cycle.setAttribute("number", cycle_number);
      newXML.appendChild(cycle);
      var count = project.createElement("count");
      count.setAttribute("number", count_number);
      cycle.appendChild(count);
      var ripple = project.createElement("ripple");
      ripple.setAttribute("number", "1");
      count.appendChild(ripple);
      var transform = project.createElement("transform");
      ripple.appendChild(transform);
      var str_node = project.createTextNode(str);
      transform.appendChild(str_node);
      
      // update indices
      if (count != 8)
      {
        current_count_index++;
        count_number++;
        document.getElementById("count").value = count_number;;
      }
      else
      {
        current_count_index = 1;
        document.getElementById("count").value = 1;
        current_cycle_index++;
        cycle_number++;
        document.getElementById("cycle").value = cycle_number;
      }
      
      return;
    }
    
    cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");
    var counts = cycles[current_cycle_index - 1].getElementsByTagName("count");
    
    // if frame exists at this spot
    // found cycle
    if ((cycles[current_cycle_index - 1].getAttribute("number") == document.getElementById("cycle").value) && counts[current_count_index - 1])
    {
      if (counts[current_count_index - 1].getAttribute("number") == document.getElementById("count").value)
      {
        if (confirm("There is already a frame for this count. Are you sure you want to overwrite this frame?"))
        {
          // overwrite
          cycles[current_cycle_index - 1].getElementsByTagName("count")[current_count_index - 1].getElementsByTagName("ripple")[current_ripple_index - 1].getElementsByTagName("transform")[0].childNodes[0].data = str;
        }
      }
      else
      {
        var count = project.createElement("count");
        count.setAttribute("number", document.getElementById("count").value);
        cycles[current_cycle_index].appendChild(count);
        var ripple = project.createElement("ripple");
        ripple.setAttribute("number", "1");
        count.appendChild(ripple);
        var transform = project.createElement("transform");
        ripple.appendChild(transform);
        var str_node = project.createTextNode(str);
        transform.appendChild(str_node);
      }
    }
    else
    {
      // add frame
      var cycle;
      var cycle_index = 1;
      var found_cycle = false;
      
      while (!found_cycle && cycle_index <= cycles.length)
      {
        if (cycles[cycle_index - 1].getAttribute("number") == document.getElementById("cycle").value)
        {
          cycle = cycles[cycle_index - 1];
          found_cycle = true;
          break;
        }
        else
        {
          cycle_index++;
        }
      }
      
      // if no cycle
      if (!cycle)
      {
        cycle_index = 1;
        var found_after = false;
        
        while (cycle_index <= cycles.length)
        {
          if (cycles[cycle_index - 1].getAttribute("number") < document.getElementById("cycle").value)
          {
            found_after = true;
            break;
          }
          
          cycle_index++;
        }
        
        if (!found_after)
        {
          cycle_index = 1;
        }
        
        var cycle_after = cycles[cycle_index - 1];
        
        // create node
        var root = project.getElementsByTagName("project")[0];
        cycle = project.createElement("cycle");
        cycle.setAttribute("number", document.getElementById("cycle").value);
        root.insertBefore(cycle,cycle_after);
        var count = project.createElement("count");
        count.setAttribute("number", document.getElementById("count").value);
        cycle.appendChild(count);
        var ripple = project.createElement("ripple");
        ripple.setAttribute("number", "1");
        count.appendChild(ripple);
        var transform = project.createElement("transform");
        ripple.appendChild(transform);
        var str_node = project.createTextNode(str);
        transform.appendChild(str_node);
        
        // update indices
        if (count_number != 8)
        {
          current_count_index++;
          count_number++;
          document.getElementById("count").value = count_number;
        }
        else
        {
          console.log("Updating indices");
          current_count_index = 1;
          document.getElementById("count").value = 1;
          current_cycle_index++;
          cycle_number++;
          document.getElementById("cycle").value = cycle_number;
        }
      }
      else
      {
        count_index = 1;
        var found_after = false;
        
        while (count_index <= counts.length)
        {
          if (counts[count_index - 1].getAttribute("number") < document.getElementById("count").value)
          {
            found_after = true;
            break;
          }
          
          count_index++;
        }
        
        if (!found_after)
        {
          count_index = 1;
        }
        
        var count_after = counts[count_index - 1];
        
        console.log(count_after);
      
        var count = project.createElement("count");
        count.setAttribute("number", document.getElementById("count").value);
        cycle.insertBefore(count, count_after);
        var ripple = project.createElement("ripple");
        ripple.setAttribute("number", "1");
        count.appendChild(ripple);
        var transform = project.createElement("transform");
        ripple.appendChild(transform);
        var str_node = project.createTextNode(str);
        transform.appendChild(str_node);
        
        // update indices
        if (count != 8)
        {
          current_count_index++;
          count_number++;
          document.getElementById("count").value = count_number;
        }
        else
        {
          current_count_index = 1;
          document.getElementById("count").value = 1;
          current_cycle_index++;
          cycle_number++;
          document.getElementById("cycle").value = cycle_number;
        }
      }
    }
  }
  
  return goToFrame(figure, cycle_number, count_number);
}

function deleteFrame(figure) {
  if (!project)
  {
    alert("No frames to delete.");
    return figure;
  }
  
  cycles = project.getElementsByTagName("project")[0].getElementsByTagName("cycle");

  if (confirm("Are you sure you want to delete this frame?"))
  {
    if (cycles)
    {
      var cycle = cycles[current_cycle_index - 1];
      var counts = cycle.getElementsByTagName("count");
      if (counts)
      {
        currNode = cycles[current_cycle_index - 1];
        currNode.removeChild(currNode.getElementsByTagName("count")[current_count_index - 1]);
        if ((current_cycle_index != 1) || (current_cycle_index == 1 && current_count_index != 1))
        {
          return lastFrame(figure);
        }
        else
        {
          results = nextFrame(figure);
          return results[0];
        }
      }
    }
  }

  return figure;
}