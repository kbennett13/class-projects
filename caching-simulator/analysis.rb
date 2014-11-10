# !/usr/bin/env ruby

####################################
# build_string(n)
#
# Constructs the input string
####################################
def build_string(n)
  str = ""
  
  str << "0203"
  
  n.times{str << "000300606008030040200"}
  
  str << "0203"
  
  (1..n).each do |c|
    str << "00003"
    
    (c..n).each do
      str << "00030600800804060181181211"
    end
    
    str << "1218161161211"
  end
  
  str = str.gsub(/\s+/, "")
end

####################################
# seek(str,a)
#
# Finds page to replace in optimal
# page replacement policy.
####################################
def seek(str,a)
  distance = []
  
  a.each do |i|
    if str.index(i)
      distance << str.index(i)
    else
      distance << str.length
    end
  end
  
  max_dist = 0
  max_index = a.length
  
  distance.each_with_index do |n,i|
    if n > max_dist
      max_index = i
    end
  end
  
  a[max_index]
end

####################################
# round
#
# Rounds results. Ruby 1.8.7 does
# not support rounding to a place.
####################################
def round(param)
  str = "#{param.floor}."
  
  d = ((param*10000)%10000).round
  
  if d >= 1000
    str << "#{d}"
  elsif d >= 100
    str << "0#{d}"
  elsif d >= 10
    str << "00#{d}"
  else
    str << "000#{d}"
  end
end

####################################
# print_results
#
# Prints results of analysis
####################################
def print_results
  # Print results
  ($sp.length - $strict_faults.to_s.length - 2).times {print " "}
  print $strict_faults.to_s  + " |"
  ($pp.length - $practical_faults.to_s.length - 2).times {print " "}
  print $practical_faults.to_s  + " |"
  ($sw.length - "#{round($strict_avg_set_size)}".length - 2).times {print " "}
  print "#{round($strict_avg_set_size)}"  + " |"
  ($pw.length - "#{round($practical_avg_set_size)}".length - 2).times {print " "}
  print "#{round($practical_avg_set_size)}"  + " |"
  ($sf.length - "#{round(1/$strict_fault_rate)}".length - 2).times {print " "}
  print "#{round(1/$strict_fault_rate)}" + " |"
  ($pf.length - "#{round(1/$practical_fault_rate)}".length - 2).times {print " "}
  print "#{round(1/$practical_fault_rate)}" + " |"
  ($sm.length - "#{$strict_max_set_size}".length - 2).times {print " "}
  print "#{$strict_max_set_size}" + " |"
  ($pm.length - "#{$practical_max_set_size}".length - 2).times {print " "}
  print "#{$practical_max_set_size}" + "\n"
end

####################################
# export
#
# Make CSV for plotting
####################################
def export(i)
  aFile = File.open("results_2.csv", "a")
  bFile = File.open("results_5.csv", "a")
  cFile = File.open("results_bonus.csv", "a")
  
  if aFile
    aFile.syswrite(i.to_s + ",")
    aFile.syswrite($strict_faults.to_s + ",")
    aFile.syswrite("#{round($strict_avg_set_size)}"  + ",")
    aFile.syswrite("#{round(1/$strict_fault_rate)}"  + "\n")
  else
    puts "Unable to open file!"
  end
  
  if bFile
    bFile.syswrite(i.to_s + ",")
    bFile.syswrite("#{round($strict_fault_rate)}"  + ",")
    bFile.syswrite("#{round($practical_fault_rate)}"  + "\n")
  else
    puts "Unable to open file!"
  end
  
  if cFile
    cFile.syswrite(i.to_s + ",")
    cFile.syswrite("#{round($n1_fault_rate)}"  + ",")
    cFile.syswrite("#{round($n2_fault_rate)}"  + "\n")
  else
    puts "Unable to open file!"
  end
end

####################################
# main (str)
#
# Analyzes the behavior of the given
# page string where n = 10
####################################
def main (n)

  str = build_string(n)
  
  str2 = build_string(n)

  # Print result headings
  $d = "Window Size (d) |"
  $sp = " Str. P(d) |"
  $pp = " Prac. P(d) |"
  $sw = " Str. W(d) |"
  $pw = " Prac. W(d) |"
  $sf = " Str. F(d) |"
  $pf = " Prac. F(d) |"
  $sm = " Str. Max |"
  $pm = " Prac. Max"

  #puts $d + $sp + $pp + $sw + $pw + $sf + $pf + $sm + $pm
  
  # Analyze behaviors of different window sizes
  (1..64).each do |i|
    # Initialize counters and containers
    $strict_faults = 0.0
    $practical_faults = 0.0
    $window = ""
    $working_set = []
    $strict_working_set_sizes = []
    $practical_working_set_sizes = []
    $strict_avg_set_size = 0.0
    $practical_avg_set_size = 0.0
    $strict_max_set_size = 0.0
    $practical_max_set_size = 0.0
    
  
    # Print window size
    ($d.length+$sp.length+$pp.length+$sw.length+$pw.length+$sf.length+$pf.length+$sm.length+$pm.length).times {print "-"}
    puts "\n"
    ($d.length - i.to_s.length - 2).times {print " "}
    print i.to_s + " |"
    
    # Step through page string with strict policy
    str.chars.each do |c|
      if (!$window.include?(c) && $window.size == i) # page not in window, >= i references into the string
        $window.reverse!.chop!.reverse!
        $window << c
        $strict_faults += 1
      elsif (!$window.include?(c) && $window.size < i) # page not in window, < i references into the string
        $window << c
        $strict_faults += 1
      elsif ($window.include?(c) && $window.size == i) # page in window, >= i references into the string
        $window.reverse!.chop!.reverse!
        $window << c
      else # page not in window, < i references into the string
        $window << c
      end
      
      l = $window.chars.to_a.uniq.length
      
      $strict_working_set_sizes << l
      
      if l > $strict_max_set_size
        $strict_max_set_size = l
      end
    end
    
    $window = ""
    $working_set = []
    
    # Step through page string with practical policy
    str.chars.each do |c|
      if (!$window.include?(c) && $window.size == i) # page not in window, >= i references into the string
        if ($working_set.include?(c)) # page not in window, but in working set
          $window.reverse!.chop!.reverse!
          $window << c
          $working_set.delete(c)
          $working_set << c
        else # page not in window and not in working set
          $window.reverse!.chop!.reverse!
          $window << c
          $working_set << c
          if $working_set.size > i
            $working_set.reverse!.pop
            $working_set = $working_set.uniq
            $working_set.reverse!
          end
          $practical_faults += 1
        end
      elsif (!$window.include?(c) && $window.size < i) # page not in window, < i references into the string
        $window << c
        $working_set << c
        $working_set = $working_set.uniq
        $practical_faults += 1
      elsif ($window.include?(c) && $window.size == i) # page in window, >= i references into the string
        $window.reverse!.chop!.reverse!
        $window << c
        $working_set.delete(c)
        $working_set << c
      else # page in window, < i references into the string
        $window << c
        $working_set.delete(c)
        $working_set << c
      end
      
      l = $working_set.uniq.length
      
      $practical_working_set_sizes << l
      
      if l > $practical_max_set_size
        $practical_max_set_size = l
      end
    end
    
    # Calculate average working set sizes
    $strict_working_set_sizes.each do |s|
      $strict_avg_set_size += s
    end
    
    $strict_avg_set_size /= $strict_working_set_sizes.length
    
    $practical_working_set_sizes.each do |s|
      $practical_avg_set_size += s
    end
    
    $practical_avg_set_size /= $practical_working_set_sizes.length
    
    # Calculate fault rate
    $strict_fault_rate = $strict_faults/(str.length)
    $practical_fault_rate = $practical_faults/(str.length)
    
    # Bonus - Optimal Page Replacement
    n1 = $practical_avg_set_size.ceil
    n2 = $strict_avg_set_size.ceil
    n1_frames = []
    n2_frames = []
    n1_faults = 0.0
    n2_faults = 0.0
    
    str.chars.each do |c|
      if !n1_frames.include?(c) && n1_frames.size == n1
        n1_faults += 1
        v = seek(str2.slice(1..-1),n1_frames)
        n1_frames.delete(v)
        n1_frames << c
      elsif !n1_frames.include?(c)
        n1_faults += 1
        n1_frames << c
      end
      
      if !n2_frames.include?(c) && n2_frames.size == n2
        n2_faults += 1
        v = seek(str2.slice(1..-1),n2_frames)
        n2_frames.delete(v)
        n2_frames << c
      elsif !n2_frames.include?(c)
        n2_faults += 1
        n2_frames << c
      end
      
      if str2.length > 1
        str2 = str2.slice!(1..-1)
      end
    end
    
    $n1_fault_rate = n1_faults/(str.length)
    $n2_fault_rate = n2_faults/(str.length)
    
    print_results
    export(i)
  end

end

main(ARGV[0].to_i)