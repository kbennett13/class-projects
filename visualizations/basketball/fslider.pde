/**
 * Draws a slider that can be dragged by the user.
 */
class fSlider {
  String name;
  
  // Width and height of the slider handle (that the user drags)
  int width = 8;
  int height = 20;
  
  // Endpoint values of the slider, and the value it is currently on
  float start, end, loc;
  float startLoc;
  
  // x and y coordinates of the left end of the slider, and the length of the slider in pixels
  int x,y,len;
  
  // Set to true when the mouse is being pressed on the slider
  boolean dragging = false;
  
  fSlider(float start, float end, float defaultLoc, int x, int y, int len) {
    this.name = name;
    
    // Smallest and largest values of the slider
    this.start = start;
    this.end = end;
    // Value where the slider is located
    loc = defaultLoc;
    startLoc = loc;
    
    // Where to draw slider on the chart
    this.x = x;
    this.y = y;
    // length in pixels
    this.len = len;
  }
  
  /**
   * Increase the position of the slider by 1.
   */
  void decrement() { 
    loc--; 
    if (loc < start) loc = start;
  }
  
  /**
   * Display the slider
   */
  void drawSlider() {
    // Draw the rail that the slider slides along
    stroke(128);
    strokeWeight(3);
    line(x,y,x+len,y);
    stroke(0);
    strokeWeight(1);
    
    // Draw the handle (marks the current value)
    fill(200);
    rectMode(CENTER);
    float sliderX = (float)(len * (loc-start) / (float)(end-start));
    rect(x+sliderX, y, 7, 15);
    
    // Label the endpoints and the current value of the slider
    fill(0);
    textAlign(LEFT);
    textSize(12);
    text(start, x-textWidth(Float.toString(start))-10, y+textAscent()/3);
    text(end, x+len+5, y+textAscent()/3);
    text(loc, x+sliderX-textWidth(Float.toString(loc))/2, y+20);
  }
  
  /**
   * Return the value that the slider is currently pointing to.
   */
  float getSize() { return loc; }
  
  /**
   * Decrease the position of the slider by 1.
   */
  void increment() { 
    loc++; 
    if (loc > end) loc = end;
  }
  
  /**
   * If the mouse was clicked on the handle, set dragging=true to update its position as long as the button is held down.
   * If the mouse was clicked somewhere else on the rail, move the slider to that position.
   * Returns the new value of the slider, or -1 if the position was not changed.
   */
  float mousePressed(int mx, int my) {
    if (!dragging) {
      if (my > y-8 && my < y+8) {
        float currX = x + (len * (loc-start) / (float)(end-start));
        if (mx > currX-4 && mx < currX+4) {
          dragging = true;
          startLoc = loc;
        }
        else if (mx > x && mx < (x+len)) {
          float diff = (float)(mx - x);
          loc = start + (float)((end - start) * diff / len + 0.5);
          return loc;
        }
      }
    }
    return loc;
  }
  
  /**
   * If dragging=true, calculate the distance along the x-axis that the mouse has moves and update the slider position.
   * Returns the current value of the slider
   */
  float mouseDragged(int mx, int my) {
    if (dragging) {
      float diff = (float)(mx - x);
      loc = start + (float)((end - start) * diff / len);
      if (loc < start) loc = start;
      if (loc > end) loc = end;
    }
    return loc;
  }
  
  /**
   * Release the slider, if it was being dragged.
   */
  void mouseReleased() {
    dragging = false;
  }
}
