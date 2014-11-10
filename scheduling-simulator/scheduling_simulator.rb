#!/usr/bin/env ruby

#################################################
# reset
#
# Initializes all global variables
#################################################
def reset
  # Initialize necessary data structures
  $ready_queue = []
  $disk_queue = []
  $ratios = []
  $waiting_time = []
  $run = []
  $process_list = [[0,4.0,0],[1,6.0,0],[2,4.0,0],[3,6.0,0],[4,4.0,0],[5,6.0,0],[6,4.0,0],[7,128.0,1]] #[pid,burst time,computational?]

  # Initialize necessary tracking
  $previous_states = []
  $current_state = ""
  $current_process = []

  $num_context_switches = 0
  $num_rounds = 0

  $global_cycle_time = 0.0
  $user_time = 0.0
  $cpu_bound_time = 0.0

  # Constants
  $switch_time = 1

  $num_comp_procs = 1
  $num_inter_procs = 7
  
  $response_time_odd = 0
  $response_time_even = 0
end



#################################################
# print_results
#
# Pretty-prints all results
#################################################
def print_results
  r = $global_cycle_time/$num_rounds
  s = $global_cycle_time/$cpu_bound_time
  u = $user_time/$global_cycle_time
  puts "\n"
  puts $algorithm
  puts "Response time (even):" + $response_time_even.to_s
  puts "Response time (odd):" + $response_time_odd.to_s
  puts "Slowdown: #{s}"
  puts "Utilization: #{(u*100).floor}.#{((u*1000)%10).round} %"
  puts "\n"
  puts "----------"
  puts "\n"
end



#################################################
# indices
#
# Condenses the first entries of the entries of a 2-dimensional array into a string
# Used for tracking rounds
#################################################
def indices(a)
  s = ""
  a.each do |i|
    s << i.first.to_s
  end
  s
end



#################################################
# round
#
# Determines if a round has completed
#################################################
def round(a1,a2)
  a1.each do |i|
    if i.to_s == a2.to_s
      return true
    end
  end
  
  false
end



#################################################
# all_run
#
# Determines whether all processes have run
#################################################
def all_run()
  t = true
  
  $run.each do |p|
    t = t && (p == 1) ? true : false
  end
  
  t
end


#################################################
# hrrn
#
# Decides which process to execute next based on Highest Response Ratio Next
#################################################
def hrrn(d)
  $algorithm = "\nAlgorithm: Highest Response Ratio Next"
  
  # Initialize waiting time and ratios
  $process_list.each do |p|
    $ratios << 0.0
    $waiting_time << 0.0
    $run << 0
  end

  # Sort processes
  s = $process_list.sort_by { |p| p[1] } # sort by shortest time
  
  # Load ready queue
  s.each do |p|
    $ready_queue << [p[0]] # add process indices to ready queue
  end
  
  # Choose process with shortest time first
  $current_process = $process_list[$ready_queue.delete_at(0).first]
  
  zeroes_seen = 0
  ones_seen = 0
  
  begin
    $global_cycle_time += $current_process[1] # add process time to global cycle
    
    if $current_process[0] == 0
      zeroes_seen += 1
      if zeroes_seen == 2
        $response_time_even = $global_cycle_time - $even_entrance
      end
    end
    if $current_process[0] == 1
      ones_seen += 1
      if ones_seen == 2
        $response_time_odd = $global_cycle_time - $odd_entrance
      end
    end
    
    $run[$current_process[0]] = 1 # mark process as run
    
    $waiting_time[$current_process[0]] = 0 # reset waiting time
  
    if $current_process[2] == 1 # computational process
      $cpu_bound_time += $current_process[1] # add CPU bound process time
    end
    $user_time += $current_process[1] # add user process time
    
    # determine if a subcycle has completed
    if (round($previous_states,indices([$current_process])+indices($ready_queue)+indices($disk_queue)))
      if $num_rounds == 0
        marker = [indices([$current_process])+indices($ready_queue)+indices($disk_queue)]
      end
      if (round($previous_states, marker))
        $num_rounds += 1
      end
    end
    
    $previous_states << [indices([$current_process])+indices($ready_queue)+indices($disk_queue)] # note state of ready and disk queues
    $disk_queue << [$current_process.first, $global_cycle_time + d]
    $global_cycle_time += 1 # context switch
    
    $ready_queue.each do |p|
      $waiting_time[p[0]] += ($current_process[1] + 1)
    end
    
    if ($global_cycle_time >= $disk_queue.first.last) # if process is finished at disk
      $ready_queue << [$disk_queue.first.first]
      $waiting_time[$disk_queue.first.first] = $global_cycle_time - $disk_queue.first.last
      if $disk_queue.first.first == 0
        $even_entrance = $global_cycle_time - $disk_queue.first.last
      end
      if $disk_queue.first.first == 1
        $odd_entrance = $global_cycle_time - $disk_queue.first.last
      end
      $disk_queue.delete_at(0)
    end
    
    $ready_queue.each do |p| # compute ratios
      $ratios[p[0]] = $waiting_time[p[0]]/$process_list[p[0]][1] 
    end
    
    $ready_queue = $ready_queue.sort_by { |p| $ratios[p[0]] }
    $ready_queue = $ready_queue.reverse
    
    $current_process = $process_list[$ready_queue.delete_at(0).first] # sort by shortest ratio and pick the first
    
  end while (!(round($previous_states,indices([$current_process])+indices($ready_queue)+indices($disk_queue)) && all_run))
  
  print_results
end



#################################################
# rr(q,d)
#
# Decides which process to execute next based on Round Robin with time quantum q
#################################################
def rr(q,d)
  puts "\n"
  $algorithm = "\nAlgorithm: Round Robin with Time Quantum #{q} and Disk Time #{d}"
  
  $time_remaining = []
  $original_state = ""
  processes_running = $process_list.length
  
  $process_list.each do |p|
    $time_remaining << [p[0], p[1].to_i, 0] # index, run time left
    $ready_queue << [p[0],q]
    $original_state << p[0].to_s << q.to_s
  end
  
  $previous_states << [$original_state]
  
  begin
    $previous_states << [$current_state]
    
    $current_state = ""
    
    $time_remaining.each do |p|
      $run[p[0]] = 1
    
      if (p[1] > q) # process still needs to run
        p[1] -= q
        $current_state << p[0].to_s << q.to_s
        $user_time += q
        if p[0] == 7
          $cpu_bound_time += q
        end
        $global_cycle_time += q + $switch_time
      elsif (p[1] == q) # process completes
        p[1] = 0
        p[2] = d
        $ready_queue.delete_if{|r| r[0] == p[0]}
        if p[0] == 7
          $cpu_bound_time += q
        end
        $user_time += q
        $global_cycle_time += q + $switch_time
        $current_state << p[0].to_s << q.to_s
      elsif (p[1] < q) && (p[1] > 0) # process runs and goes to disk
        $user_time += q - p[1]
        if p[0] == 7
          $cpu_bound_time += q - p[1]
        end
        p[2] = (d-p[1])
        $current_state << p[0].to_s << p[1].to_s
        $ready_queue.delete_if{|r| r[0] == p[0]}
        p[1] = 0
        $global_cycle_time += q + $switch_time
      elsif (p[2] > q) # process stays at disk
        p[2] -= q
        $current_state << p[0].to_s << "0"
        $global_cycle_time += q
      elsif p[2] == q # process finishes disk service
        p[1] = $process_list[p[0]][1]
        p[2] = 0
        $current_state << p[0].to_s << "0"
        $global_cycle_time += q
      elsif (p[2] < q) && (p[2] > 0) # process comes out of disk service and runs
        p[1] = ($process_list[p[0]][1] - q + p[2])
        $user_time += q - p[2] + 1
        if p[0] == 7
          $cpu_bound_time += q - p[2] + 1
        end
        $current_state << p[0].to_s << (q - p[2]).to_s
        p[2] = 0
        $global_cycle_time += q + $switch_time
      end
    end
    
    # mark recurring state
    if round($previous_states, $current_state) && ($num_rounds == 0)
      marker = $current_state
      $num_rounds = 1
    elsif $current_state == marker
      $num_rounds += 1
      puts i
    end
    
  end while (!($num_rounds == 2) && !all_run)
    
  print_results
end



#################################################
# main
#
#
#################################################
def main
  #reset
  #hrrn(9)
  #reset
  #hrrn(19)
  #reset
  #hrrn(39)
  reset
  rr(4,9)
  #reset
  #rr(4,19)
  #reset
  #rr(4,39)
  reset
  rr(2,9)
  #reset
  #rr(2,19)
  #reset
  #rr(2,39)
  reset
  rr(7,9)
  #reset
  #rr(7,19)
  #reset
  #rr(7,39)
end

main