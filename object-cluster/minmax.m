function [min_array, max_array] = minmax(D)
    [num_samples, dim] = size(D);
    min_array = zeros(1,dim);
    max_array = zeros(1,dim);
    
    for i = 1:dim
        min = 1;
        max = 0;
        
        for j = 1:num_samples
            if D(j,i) < min
                min = D(j,i);
            end
            
            if D(j,i) > max
                max = D(j,i);
            end
        end
        
        min_array(i) = min;
        max_array(i) = max;
    end