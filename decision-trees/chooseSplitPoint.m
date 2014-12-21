function [d,v] = chooseSplitPoint(m,data,labels,label_counts)
    [num_points,dim] = size(data);
    [~,num_labels] = size(label_counts);
    
    max_gain = 0;
    
    % find entropy before split
    pre_e = 0;
    for i = 1:num_labels
        if label_counts(i) > 0
            pre_frac = label_counts(i)/num_points;
            pre_e = pre_e - pre_frac*log2(pre_frac);
        end
    end

    for i = 1:dim
        disp(m)
        disp(i)
        all_values = zeros(1,num_points);
        
        % get possible values
        for j = 1:num_points
            all_values(j) = data(j,i);
        end
        
        % sort values
        all_values = sort(all_values);
        
        % test midpoints
        for j = 1:(num_points - 1)
            % if consecutive values are the same
            if (all_values(j + 1) - all_values(j)) == 0
                continue;
            else
                midpoint = all_values(j) +...
                    ((all_values(j + 1) - all_values(j))/2);
                
                num_in = zeros(1,num_labels);
                num_out = zeros(1,num_labels);
                
                for k = 1:num_points
                    p = data(k,:);
                    if p(i) <= midpoint
                        num_in(labels(k)) = num_in(labels(k)) + 1;
                    else
                        num_out(labels(k)) = num_out(labels(k)) + 1;
                    end
                end
                
                e_in = 0;
                e_out = 0;
                
                for k = 1:num_labels
                    
                    in = num_in(k)/sum(num_in);
                    out = num_out(k)/sum(num_out);
                    
                    if in > 0
                        e_in = e_in - in*log2(in);
                    end
                    
                    if out > 0
                        e_out = e_out - out*log2(out);
                    end
                
                end
                
                post_e = (sum(num_in)/num_points)*e_in +...
                    (sum(num_out)/num_points)*e_out;
                
                % determine gain
                gain = pre_e - post_e;
                
                if gain > max_gain
                    max_gain = gain;
                    d = i;
                    v = midpoint;
                end
            end
        end
    end